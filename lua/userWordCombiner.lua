local config = require('config').default
local shared = require('shared')
local predictCharToPush = config.predict.charToPush or ''
local rimeUt = require("rimeUtil")
local ut = require('ut')
local algo = require('algo')
local M = {}
M.processor = {}
M.segmentor = {}
M.translator = {}
M.filter = {}
local timeTo = {
	clearHisAsync = false
}
local commit__inputHisDeq = shared.userWordCombiner.commit__inputHisDeq
local dictName = ''
local reverseDb---@type ReverseDb
local commitNotifier
local commitConne
local selectNotifier
local selectConne
local mem ---@type Memory

----
local ignoreSingleChar = config.userWordCombiner.ignoreSingleChar
local delimiter
local fullPunctArr = config.userWordCombiner.fullPunctArr
local fullPunctSet = shared.userWordCombiner.fullPunctSet

---@param env Env
local function init(env)
	local id = env.engine.schema.schema_id
	config = shared.loadConfig(id)
	shared.userWordCombiner.init_fullPunctSet(id)
	ignoreSingleChar = config.userWordCombiner.ignoreSingleChar
	delimiter = config.userWordCombiner.delimiter
	fullPunctArr = config.userWordCombiner.fullPunctArr
	fullPunctSet = shared.userWordCombiner.fullPunctSet
end

local isTimeToClearDeq = shared.userWordCombiner.isTimeToClearDeq
local isAPrefixOfB = algo.isAPrefixOfB
local reverseLookup = rimeUt.reverseLookupForSingleChar

--- ['睡','覺'] -> ['shui jiao ', 'shui jue ']
---@param db ReverseDb
---@param chars string[] 漢字數組 from hisDeq
---@param inputCodes string[] from hisDeq
---@return string[] custom_code也、末有空格
local function getCustomCodesOfChars(db, chars, inputCodes)
	local codes =  rimeUt.seekCodesOfChars(db, chars, inputCodes)
	local ans = {} ---@type string[]
	for i,code in ipairs(codes)do
		ans[i] = code..' '
	end
	return ans
end

---@param db ReverseDb
---@param hisDeq HistoryDeque<string[]>
---@return table<string, string[]> k: 漢字詞組, v: customCode字串數組
local function get_word__customCodes(db, hisDeq)
	local ans = {} ---@type table<string, string[]>
	--local c_cb_cba = HistoryDeque.abc_to_c_cb_cba(hisDeq)
	local arrOfchar__code = hisDeq:toArrFromFront() ---@type string[][] 不會出現:--- [['春','chun'],['眠','mian'], ['不覺', 'bujue']]、'不覺'既拆開
	--local c_cb_cba = HistoryDeque.abc_to_c_cb_cba(hisDeq) --- [春眠不覺, 眠不覺, 不覺]
	
	local commits = {} ---@type string[] -- ['春', '眠', '不','覺']
	local inputCodes = {} ---@type string[] -- ['chun', 'mian', 'bu', 'jue']
	
	for i, char__code in ipairs(arrOfchar__code)do
		commits[i] = char__code[1]
		inputCodes[i] = char__code[2]
	end
	-- local commitCba = algo.abc_to_a_ab_abcStr(commits) --[春,春眠, 春眠不, 春眠不覺]
	-- local inputCodesCba = algo.abc_to_a_ab_abcStr(inputCodes)
	
	local commitAbc = algo.abc_to_c_bc_abc(commits) ---[['春'],['春', '眠'], [春,眠,不], [春,眠,不,覺]]
	local inputCodesAbc = algo.abc_to_c_bc_abc(inputCodes)
	for i,oneCommit in ipairs(commitAbc)do
		local oneCodes = inputCodesAbc[i]
		local codes = getCustomCodesOfChars(db, oneCommit, oneCodes)
		local concated = table.concat(oneCommit, '')
		ans[concated] = codes
	end
	return ans
end


---@param word__customCodes table<string, string[]> from get_word__customCodes
---@return DictEntry[]
local function getDictEntries(word__customCodes)
	local ans = {} ---@type DictEntry[]
	for word,cusCodes in pairs(word__customCodes)do
		for i, cusCode in ipairs(cusCodes)do
			local ua = DictEntry()
			ua.text = word
			ua.custom_code = cusCode
			table.insert(ans, ua)
		end
	end
	return ans
end

---@param mem Memory
---@param dictEntries DictEntry[] from getDictEntries
local function addEntriesInUser(mem, dictEntries)
	local sub = ut.utf8_sub
	---@param str string
	local function len(str)
		return utf8.len(str) or 0
	end
	for i,de in ipairs(dictEntries)do
		--Wat(commit__inputHisDeq._data)
		if ignoreSingleChar and utf8.len(de.text)==1 then
			goto continue
		end
		if sub(de.custom_code, 1, 1)==' ' or sub(de.custom_code, len(de.custom_code)-1, len(de.custom_code)) == '  ' then
			goto continue
		end
		mem:update_userdict(de, 1, '')
		--Wat(de.text)
		::continue::
	end
end


-- ---@param db ReverseDb
-- ---@param mem Memory
-- ---@param hisDeq HistoryDeque<string>
-- ---@deprecated
-- ---nonPureFn
-- local function getEntryEtUpdate_depecated(db, mem, hisDeq)
-- 	local word__customCodes = get_word__customCodes_deprecated(db, hisDeq)
-- 	local des = getDictEntries(word__customCodes)
-- 	addEntriesInUser(mem, des)
-- end

---@param db ReverseDb
---@param mem Memory
---@param hisDeq HistoryDeque<string[]>
---nonPureFn
local function getEntryEtUpdate(db, mem, hisDeq)

	local word__customCodes = get_word__customCodes(db, hisDeq)
	
	local des = getDictEntries(word__customCodes)
	addEntriesInUser(mem, des)
end

local function clearHisDeq()
	commit__inputHisDeq:clear()
end

---@param ctx Context
local commitCallback = (function (ctx)
	--local commit = ctx:get_commit_text()
	local commit ---@type string
	local sele = ctx:get_selected_candidate()
	if sele then
		local gen = sele:get_genuine()
		commit = gen.text
	else
		commit = ctx:get_commit_text()
	end
	local input = ctx:get_preedit().text --不覺曉 -> pja|kuk|hxu‸
	
	input = ut.utf8_sub(input, 1, utf8.len(input)-1)  --- 除末字符「‸」、默認此字符在末
	if input == nil or input == predictCharToPush then
		input = ''
	end
	if utf8.len(commit) >1 then ---若一次性上屏逾一字則拆作單字
		local inputs = ut.splitString(input, delimiter)
		local commits = ut.splitString(commit, '')
		for i, oneCommit in ipairs(commits)do
			commit__inputHisDeq:addBackF({oneCommit, inputs[i]})
		end
	else
		local commit__input = {commit, input}
		commit__inputHisDeq:addBackF(commit__input)
	end
	
	if isTimeToClearDeq(commit) then
		clearHisDeq()
	end

end)

---@param ctx Context
local selectCallback = (function (ctx)
	--getEntryEtUpdate_depecated(reverseDb, mem, commitHisDeq)
	getEntryEtUpdate(reverseDb, mem, commit__inputHisDeq)
	timeTo.clearHisAsync = true
end)



---@param env Env
function M.processor.init(env)
	init(env)
	timeTo.clearHisAsync = false
	local ctx = env.engine.context
	commitNotifier = ctx.commit_notifier
	selectNotifier = ctx.select_notifier

	commitConne = commitNotifier:connect(commitCallback)
	selectConne = selectNotifier:connect(selectCallback)

	rimeUt.init_spellerMaps(env)
	mem = Memory(env.engine, env.engine.schema)
	dictName = env.engine.schema.config:get_string('translator/dictionary')
	reverseDb = ReverseLookup(dictName)
	rimeUt.init_spellerMaps(env)
end

function M.processor.func(key, env)---@type ProcessorFn
	local keyCode = key.keycode
	local keyCodeStr = tostring(keyCode)
	local repr = key:repr()
	local ctx = env.engine.context

	
	if not ctx:has_menu()then
		if keyCode ~= 32 and not(49<= keyCode and keyCode <= 57) and not rimeUt.keyCode__spellerChar[keyCodeStr] then
			clearHisDeq()
		end
	end
	local input = ctx.input

	return 2
end


return M

