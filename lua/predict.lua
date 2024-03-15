--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG

配置在config.lua中。最好先閱讀config.lua 中 的default.predict中的說明
在<User_Data>/rime.lua中加入:
```lua
local predict = require("predict")
predict_P = predict.processor
predict_T = predict.translator
```

然後把引入的組件分別加入<方案名>.schema.yaml


```yaml
engine:
  processors:
    - lua_processor@predict_P
    #...
  translator:
    - lua_translator@predict_T
    #...

```

 ]]

local config = require('config').default
local shared = require('shared')
local ut = require('ut')
local rimeUt = require("rimeUtil")
local HistoryDeque = require("HistoryDeque")
local optName = config.predict.switchName ---$此模塊的開關ˋ在schema中之名
--local charToPush = '$' ---$
local charToPush = config.predict.charToPush
local predictCandTag = 'predict' ---$
local reverseName = 'prd' ---$
local reverseDbPath = 'build_/'..reverseName..'.reverse.bin'
local reversedb= ReverseDb(reverseDbPath) ---$
local defaultPredict = {'的','一','是','了','我'} ---$默認添加到最後的聯想詞、㕥防搜索不到候選或候選過少
local commitHistoryDepth = 4 --- $輸入歷史ˉ雙端隊列之最大容量
local splitterOfpredictWord__quality = '_' --- $dict.yaml中聯想詞與默認權重之分隔符
local dyDictEntries = {} ---@type DictEntry[]
local text__dyDictEntries = {} ---@type table<string, DictEntry>
local ignoreSingleChar = config.userWordCombiner.ignoreSingleChar


---@param env Env
local function init(env)
	config = shared.loadConfig(env.engine.schema.schema_id)
	charToPush = config.predict.charToPush
	optName = config.predict.switchName ---$此模塊的開關ˋ在schema中之名
	predictCandTag = 'predict' ---$
	reverseName = 'prd' ---$
	reverseDbPath = 'build_/'..reverseName..'.reverse.bin'
	reversedb= ReverseDb(reverseDbPath) ---$
	defaultPredict = {'的','一','是','了','我'} ---$默認添加到最後的聯想詞、㕥防搜索不到候選或候選過少
	commitHistoryDepth = 4 --- $輸入歷史ˉ雙端隊列之最大容量
	splitterOfpredictWord__quality = '_' --- $dict.yaml中聯想詞與默認權重之分隔符
	dyDictEntries = {} ---@type DictEntry[]
	text__dyDictEntries = {} ---@type table<string, DictEntry>
	ignoreSingleChar = config.userWordCombiner.ignoreSingleChar
end


--local Deque = require("ArrayDeque")

local M = {}
M.processor={}
M.segmentor = {}
M.translator={}
M.filter={}

local cands={}
local k3 = {
	kRejected = 0
	,kAccepted = 1
	,kNoop = 2
}


local mem---@type Memory
local dyMem---@type Memory
--local reversedb= ReverseLookup(reverseName)
assert(reversedb, "failed create reversedb : "..reverseName)
--local testCand = Candidate('test', 0, 1, '測', '試')
local lastCommitStr = ''
local numMap = {} ---@type table<string, number>
for i = 1,9 do
	local num = tostring(i)
	numMap[num] = i
end
local timeTo = {}
timeTo.pushInput = false
timeTo.predict = false
timeTo.remove_charToPush = false
local yieldedPredCand = false
local prevCandStr = ''


local tempHisDeq = HistoryDeque.new(commitHistoryDepth)---@type HistoryDeque<string>

local hisDeq = HistoryDeque.new(16) ---@type HistoryDeque<string> ---僅用于記錄、不清空



local t2s
t2s = Opencc('t2s.json')
--local ldb = LevelDb(ldbPath, '')



---@generic T
---@param deque Deque<T>
---@param ele T
local addBackF = function (deque, ele)
	deque:addBackF(ele)
end

---@generic T
---@param deque HistoryDeque<T>
---@param ele T
local addFrontF = function (deque, ele)
	deque:addFrontF(ele)
end




local abc_to_c_cb_cba = HistoryDeque.abc_to_c_cb_cba

---@param arr any[]
local function reverseArrInPlace(arr)
	local left, right = 1, #arr
	while left < right do
		arr[left], arr[right] = arr[right], arr[left]
		left = left + 1
		right = right - 1
	end
end



local turnOn
local turnOff

local isOn

local commitNotifier
local commitConne

local selectNotifier
local selectConne

local optUpdateNotifier
local optUpdateConne

local testCommitHistoryTable = {}---@type string[]


local isTimeToClearDeq = shared.userWordCombiner.isTimeToClearDeq


---@param ctx Context
local function pushRealInput(ctx)
	if ctx.input == charToPush then
	elseif string.sub(ctx.input, 1, #charToPush) == charToPush then
		local realInput = string.sub(ctx.input, 2)
		ctx:pop_input(2)
		ctx:push_input(realInput)
	end
end




---@param commit string
---@return boolean true則錄入
local function dyMemFilter(commit)
	if ignoreSingleChar then
		if utf8.len(commit) == 1 then
			return false
		end
	end
	return true
end

---@param commit string
local function updateDyMem(commit)
	local r = dyMemFilter(commit)
	if not r then
		return
	end
	local de = DictEntry()
	--commit = s2t:convert(commit)
	de.text = commit
	de.custom_code = commit
	dyMem:update_userdict(de, 1, '')
end


---@param env Env
local function init_dyMem(env)
	local schema = Schema(reverseName)
	dyMem = Memory(env.engine, schema)
end


---@param ctx Context
local commitCallback = (function (ctx)
	if isOn then

	end
	-- prevCandStr = ctx:get_commit_text()
	-- prevCandStr = s2t:convert(prevCandStr)
	local commit ---@type string
	local sele = ctx:get_selected_candidate()
	if sele then
		local gen = sele:get_genuine()
		commit = gen.text
	else
		commit = ctx:get_commit_text()
	end
	prevCandStr = commit
	addBackF(tempHisDeq, prevCandStr) -- 關閉聯想旹猶錄
	hisDeq:addBackF(prevCandStr)
	if isTimeToClearDeq(prevCandStr) then
		tempHisDeq:clear()
	end
	local cbaArr = tempHisDeq:toArrFromFront() ---@type string[]
	if cbaArr == nil or #cbaArr == 0 then
		return
	end
	local cba = table.concat(cbaArr, '')
	updateDyMem(cba)
	-- local value = ut.nc(
	-- 	ldb:fetch(inp), '0'
	-- )
	-- local valueNum = assert(tonumber(value),'')
	-- valueNum = valueNum + 1
	-- value = tostring(valueNum)
	-- ldb:update(inp, value)
	
end)

---@param ctx Context
local selectCallback = function (ctx)
	if isOn and (ctx.input==nil or ctx.input=='') then
		timeTo.predict=true --當珩于前
		ctx:push_input(charToPush)
	end
	--Wat('select')
end



---@param ctx Context
local optUpdateCallback = function (ctx)
	isOn = ctx:get_option(optName)
	-- if isOn then
	-- 	turnOn()
	-- 	Wat('turned on')
	-- else
	-- 	turnOff()
	-- 	Wat('turned off')
	-- end
end

---@param str string
---@return boolean
local function dyMemRemove(str)
	local has = dyMem:user_lookup(str, true) -- 傳入false則尋不見、傳入true則多找
	--Wat('str: '..str)
	--Wat('has:')
	--Wat(has) --false
	for de in dyMem:iter_user()do
		--Wat('det: '..de.text)
		if de.text == str then
			--de.custom_code = '' 叵改此。否則update旹不效。
			local r = dyMem:update_userdict(de, -1, '')
			log.info('deleted: '..str)
		end
	end
	return true
end

local function removeAllInDyMem()
	dyMem:user_lookup('',true)
	for de in dyMem:iter_user()do
		dyMem:update_userdict(de, -1, '')
		log.info(de.text)
	end
end

--- 須在初始化旹用、若用戶詞典既被程序加載則開不得
local function rm_rf_dyMem()
	--local path = 'D:\\Program Files\\Rime\\User_Data\\prd.userdb'
	local userDir = rime_api.get_user_data_dir()
	Wat(userDir)
	local path = userDir..'/'..reverseName..'.userdb'
	local db = LevelDb(path, '')
	if db then db:open()
		local q = db:query('')
		for k,v in q:iter() do
			local sp = ut.splitString(k, '\t')
			-- log.error('~~~')
			-- Wat(k)
			-- Wat(v)
			-- Wat(sp)
			-- log.error('---')
			local text = sp[1] or ''
			local customCode = sp[2] or ''
			if utf8.len(text)>5 then
				db:erase(k)
				Wat('delete: '..k)
			end
		end
		-- for key,value in db:query("") do -- 從頭    
		-- 	if value:match("c=-1") then
		-- 		db:earse(key)
		-- 	end
		-- end
	else
		Wat('open failed')
	end
end


--local spellerChar__keyCode = rimeUt.spellerChar__keyCode
--local keyCode__spellerChar = rimeUt.keyCode__spellerChar
---@param env Env
local function init_spellerChar__keyCode(env)
	rimeUt.init_spellerMaps(env)
end


---@param env Env
function M.processor.init(env)
	init(env)
	local ctx = env.engine.context
	init_spellerChar__keyCode(env)
	init_dyMem(env)
	commitNotifier = ctx.commit_notifier
	selectNotifier = ctx.select_notifier
	turnOn = function () 
		commitConne = commitNotifier:connect(commitCallback)
		selectConne = selectNotifier:connect(selectCallback)
	end
	turnOn()

	-- turnOff = function ()
	-- 	if commitConne then
	-- 		commitConne:disconnect()
	-- 	end
	-- 	if selectConne then
	-- 		selectConne:disconnect()
	-- 	end
		
	-- end

	optUpdateNotifier = env.engine.context.option_update_notifier
	optUpdateConne = optUpdateNotifier:connect(optUpdateCallback)
	--env.engine:apply_schema()
	--Schema()
	local schema ---@type Schema
	schema = env.engine.schema
	mem = Memory(env.engine, schema)
	-- mem:memorize(function (commitEntry)
	-- 	for i,dictEntry in ipairs(commitEntry:get())do
	-- 		Wat(dictEntry.text)
	-- 		Wat(dictEntry.weight)
	-- 		Wat(dictEntry.comment)
	-- 		--Wat(rime_api.get_rime_version())
	-- 	end
	-- end)
	--removeAllInDyMem()
end

-- local KCode={
-- 	shiftL = 65505
-- 	,shiftR = 65506
-- 	,ctrl = 65507
-- 	,meta = 65511
-- 	,alt=65513
-- }

function M.processor.func(key, env)---@type ProcessorFn
	local ctx = env.engine.context
	local repr = key:repr()
	local keyCode = key.keycode
	local keyCodeStr = tostring(keyCode)
	
	--Wat('keyCode:'..keyCode)
	--Wat('repr:'..repr)
	--local ks = KeySequence('Control+k')
	-- local ks = KeySequence()
	-- ks:parse('Control+k')
	-- local kse = ks:toKeyEvent()
	-- log.error('ks')
	-- Wat(ks:repr())
	-- log.error('kse')
	-- Wat(kse:repr())
	--Wat(repr)

	-- Wat(isOn)
	-- Wat(ctx.input)
	-- Wat(yieldedPredCand)
	-- if (ctx.input == charToPush and (yieldedPredCand == false or not isOn)) then
	-- 	-- Wat(isOn)
	-- 	-- Wat(ctx.input)
	-- 	-- Wat(yieldedPredCand)
	-- 	env.engine:commit_text(charToPush)
	-- 	return k3.kAccepted
	-- end


	pushRealInput(ctx) --- 須置于 if has_menu之前

	if not ctx:has_menu() then
		if repr == 'BackSpace' then
			tempHisDeq:clear()
			return k3.kNoop
		end
		return k3.kNoop
	end
	
	-- Wat('repr: '..repr)
	-- Wat('ctrl: ')
	-- Wat(key:ctrl())
	-- Wat('yieldedPredCand: ')
	-- Wat(yieldedPredCand)
	-- log.error('----------')
-- 加此if代碼塊後、小狼毫0.15.0有蠹: 有聯想候選旹不可以橫排數字2鍵擇候選項上屏。1,3,4,空格等皆無此象。遷代碼珩于同文3.2.15亦無此象
	--if yieldedPredCand == true and ctx.input == charToPush then
	if ctx.input == charToPush then
		yieldedPredCand = false
		if rimeUt.keyCode__spellerChar[keyCodeStr]then
			--pushRealInput(ctx)
		elseif keyCode == 32 then --空格
			return k3.kNoop
		elseif (49<= keyCode and keyCode <= 57) then --除0外
			-- local num = numMap[repr]
			-- ctx:select(num)
		elseif repr == 'BackSpace' then
			tempHisDeq:clear()
			return k3.kNoop
		elseif repr == 'Return' or repr == 'Tab' then
			ctx:clear()
			--return k3.kAccepted
			return k3.kNoop 
		--elseif key:ctrl() or repr=='Release+Control_L' or repr == 'Control+Control_L' then
		elseif keyCode == 48 or repr == '0' then --其實是Release+0 ?
			local sele = ctx:get_selected_candidate()
			local back = hisDeq:back() ---@type string
			dyMemRemove(back..sele.text)
			tempHisDeq:clear()
			return k3.kAccepted
		elseif repr=='Up' or repr == 'Release+Up' or repr == 'Down' or repr == 'Release+Down' then
			
		else
			ctx:clear()
			return k3.kNoop
		end
			--ctx:clear()
	end



	-- if ctx.input == charToPush then

	-- elseif string.sub(ctx.input, 1, #charToPush) == charToPush then
	-- 	local realInput = string.sub(ctx.input, 2)
	-- 	ctx:pop_input(2)
	-- 	ctx:push_input(realInput)
	-- end
	
	return k3.kNoop
end


---@param env Env
function M.processor.fini(env)

end

---@param env Env
function M.segmentor.init(env)
	
end

function M.segmentor.func(segmentation, env)---@type SegmentorFn
	local ctx = env.engine.context

end

---@param env Env
function M.translator.init(env)
	
end

--[[ 

當輸入爲「一二三四」旹
先搜「一二三四」
然後「二三四」
然後「三四」
...
 ]]

---@param env Env
---@param seg Segment
---@param c_cb_cba string[]
---@return Candidate[]
local function geneStaticPredictCands(env, seg, c_cb_cba)
	local ctx = env.engine.context
	local cands = {} ---@type Candidate[]
	local cCbCbaArr = c_cb_cba
	--log.error('cCbCbaArr:')
	--Wat(cCbCbaArr)
	for i,inputStr in ipairs(cCbCbaArr) do
		-- c -> cb -> cba
		--Wat('inputStr: '..inputStr)
		--local predictStrs = reversedb:lookup(s2t:convert(inputStr))
		local predictStrs = reversedb:lookup(inputStr)
		local predictStrArr = ut.splitString(predictStrs, ' ')
		--log.error('Wat(predictStrArr)')
		--Wat(predictStrArr)
		for j, onePredict in ipairs(predictStrArr)do
			if onePredict=='' then
				goto continue
			end
			--Wat('onePredict: '..onePredict)

			local predictWord__quality = ut.splitString(onePredict, splitterOfpredictWord__quality)
			local predictWord = assert(predictWord__quality[1], 'splitted[1]')
			if ctx:get_option('simplification') then
				predictWord = t2s:convert(predictWord)
			end
			local qualityStr_ori = ut.nc(predictWord__quality[2], '0')---@type string
			local quality_ori = ut.nc(tonumber(qualityStr_ori), 0)
			
			local quality = math.log(1000^(i+1) + quality_ori)
			local comment = i..'-'..j..'-'..inputStr..'-'..quality..'-'..qualityStr_ori
			if config.predict.noComment then
				comment = ''
			end
			local cand = Candidate(
				predictCandTag
				, seg.start
				, seg._end
				, predictWord
				, comment
			)
			
			cand.quality = quality
			table.insert(cands, cand)
			::continue::
		end -- for j
	end -- for i
	return cands
end

---@param env Env
---@param seg Segment
---@param c_cb_cba string[]
---@return Candidate[]
local function geneUserPredictCands(env, seg, c_cb_cba)
	
	local ctx = env.engine.context
	local des = {}---@type DictEntry[]
	local phrases = {} ---@type Phrase[]
	local cands = {} ---@type Candidate[]
	--dyDictEntries = {} ---清空
	text__dyDictEntries = {}
	for i=#c_cb_cba, 1 ,-1 do
		local inputStr = c_cb_cba[i]
		dyMem:user_lookup(inputStr, true)
		for de in dyMem:iter_user()do
			local dt = de.text
			local sub = ut.utf8_sub(dt, utf8.len(inputStr)+1, utf8.len(dt))
			--Wat(dt)
			--Wat(sub)
			if sub == nil or sub == ''then
				goto continue
			end
			if ctx:get_option('simplification') then
				sub = t2s:convert(sub)
			end
			de.text = sub
			
			--de.text = ut.utf8_sub(de.text, utf8.len(de.text))
			local ph = Phrase(dyMem, 'dyMem', seg.start, seg._end, de)
			--local cand = ph:toCandidate()
			local cand = Candidate('dyMem', seg.start, seg._end, de.text, '')
			cand.quality = math.log((100*de.commit_count)^(#inputStr) / #de.text) + de.weight
			if config.predict.noComment then
				
			else
				cand.comment = 'dy'..inputStr..'-'..cand.quality
			end
			
			table.insert(des, de)
			table.insert(phrases, ph)
			table.insert(cands, cand)
			--table.insert(dyDictEntries, de)
			text__dyDictEntries[de.text] = de
			::continue::
		end
	end
	return cands
end





function M.translator.func(input, seg, env) ---@type TranslatorFn
	local ctx = env.engine.context

	if timeTo.predict then
		local cCbCbaArr = abc_to_c_cb_cba(tempHisDeq)---@type string[]
		--env.engine.context:push_input(' ')
		timeTo.predict = false
		yieldedPredCand = true
		local cands = geneStaticPredictCands(env, seg, cCbCbaArr)
		geneUserPredictCands(env, seg, cCbCbaArr)
		if true then --或可增開關
			local dyCands = geneUserPredictCands(env ,seg, cCbCbaArr)
			for i,cand in ipairs(dyCands)do
				table.insert(cands, cand)
			end
		end
		table.sort(cands, function (a, b)
			return a.quality > b.quality -- lua中當返bool
		end)

		for i,cand in ipairs(cands)do
			yield(cand)
		end

		
		for i,v in ipairs(defaultPredict)do
			local cand = Candidate(predictCandTag, seg.start, seg._end, v, '*')
			cand.quality=1
			yield(cand)
		end
		
	end -- if timeToPredict
	
end

function M.filter.func(trans, env) ---@type FilterFn
	local ctx = env.engine.context
	--TswG.yieldAllTrans(trans)
	for cand in trans:iter()do
		yield(cand)
		--Wat(cand.type)
		--Wat(cand:get_dynamic_type())
	end
	 
end
return M
--[[ 
當輸入潙
一二三四
旹
尋:
四
三四
二三四
一二三四
後者權重高

過程:
(頭)一二三四(尾)
從尾始遍歷、保持原序


 ]]

--[[ 
TODO
- [ ] 原單擊n鍵、出候選「你,那,能,而,二,如...」
設當余輸入「不知其」後、出聯想:「~二」,「~所」。
而後再擊n鍵、則所出候選中使「~二」至最前。

 ]]