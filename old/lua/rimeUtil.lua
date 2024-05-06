
--[[ 
Copyright (c) 2024 TsinswrengGwāng<tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local ut = require("ut")
local algo = require('algo')
local M = {}
M.t2s = Opencc('t2s.json')
M.s2t = Opencc('s2t.json')
M.t2jp = Opencc('t2jp.json')
--M.jp2t = Opencc('jp2t.json') 無此

---@param translation Translation
function M.yieldAllTrans(translation)
	for cand in translation:iter()do
		yield(cand)
	end
end

M.spellerChar__keyCode = nil ---@type table<string, number>
M.keyCode__spellerChar = nil ---@type table<string, string>

---@param env Env
function M.init_spellerMaps(env)
	if M.spellerChar__keyCode ~= nil then
		return
	end
	M.spellerChar__keyCode = {}
	M.keyCode__spellerChar = {}
	local speller = env.engine.schema.config:get_string('speller/alphabet')
	local spellerArr = ut.splitString(speller, '')
	for i,char in ipairs(spellerArr)do
		local charCode = string.byte(char)
		M.spellerChar__keyCode[char] = charCode
		M.keyCode__spellerChar[tostring(charCode)] = char
	end
end

M.commitNotifier = nil
-- M.commitConnection = nil
M.selectNotifier = nil
-- M.selectConnnection = nil


---@param env Env
---@param commitCallback fun(ctx:Context)|nil
---@param selectCallback fun(ctx:Context)|nil
function M.initCommitEtSelectNotifier(env, commitCallback, selectCallback)
	local ctx = env.engine.context
	M.commitNotifier = ctx.commit_notifier
	M.selectNotifier = ctx.select_notifier
	local commitConne
	local selectConne
	if commitCallback then
		commitConne = M.commitNotifier:connect(commitCallback)
	end

	if selectCallback then
		selectConne = M.selectNotifier:connect(selectCallback)
	end
	return commitConne, selectConne
end

M.k3 = {
	---声称本组件和其他组件都不响应该输入事件，立刻结束 processors 流程，交还由系统按默认方式响应（ASCII字符上屏、方向翻页等功能键作用于客户程序或系统全局……）。注意：如果 processor 已响应该输入事件但返回 kRejected，一次按键会接连生效两次。
	kRejected = 0
	---声称本函数已响应该输入事件，结束 processors 流程，之后的组件和系统都不得响应该输入事件。注意：如果 processor 未响应该输入事件但返回 kAccepted，相当于禁用这个按键
	,kAccepted = 1
	---声称本函数不响应该输入事件，交给接下来的 processors 决定。注意：如果 processor 已响应该输入事件但返回 kNoop，一次按键可能会接连生效多次。如果所有 processors 都返回kNoop，则交还由系统按默认方式响应。
	,kNoop = 2
}

---O(log n)
---當inputCode潙空: 車 -> ['che', 'ju']
---當inputCode潙'c'或'ch'或'che'旹: 車 -> ['che']
---若經inputCode篩選後無果則返篩選前ᵗ果
---@param db ReverseDb
---@param char string 單個漢字
---@param inputCode string|nil
---@return string[]
function M.reverseLookupForSingleChar(db, char, inputCode)
	local codeStr = db:lookup(char) -- O(log n)
	local gotCodes = ut.splitString(codeStr, ' ') -- O(n)
	local ans = gotCodes
	--Wat(ans)
	--Wat(ans)
	if inputCode ~= nil and inputCode ~= '' then
		local inputCodeLen = utf8.len(inputCode)
		if inputCodeLen ~= nil then
			ans = {}
			for i, gotCode in ipairs(gotCodes)do
				-- local gotCodeSub = ut.utf8_sub(gotCode, 1, inputCodeLen)

				-- if gotCodeSub == inputCode then
				-- 	table.insert(ans, gotCode)
				-- end
				if algo.isAPrefixOfB(inputCode, gotCode) then
					table.insert(ans, gotCode)
				end
			end
		end
	end
	if #ans == 0 then --當輸入含輔助碼旹 如 伊蕾娜 qda ruyT nzy 、 緣 蕾ᵗ碼多出一'T'致前綴匹配旹無ʃ匹得
		ans = gotCodes
	end
	--log.error('codes') #
	return ans
end

--- ['睡','覺'] -> [['shui'], ['jiao', 'jue']]
---@param db ReverseDb
---@param chars string[] 單字ᵗ數組
---@param inputCodes string[]|nil
---@return string[][]
function M.seekCodesOfChars_2dArr(db, chars, inputCodes)
	inputCodes = inputCodes or {}
	local reverse = {} ---@type string[][]
	for i,char in ipairs(chars)do
		local input = inputCodes[i]
		local ua = M.reverseLookupForSingleChar(db, char, input)
		reverse[i] = ua
	end
	
	return reverse
end

--- ['睡','覺'] -> ['shui jiao', 'shui jue']
---@param db ReverseDb
---@param chars string[] 單字數組
---@param inputCodes string[]|nil
---@return string[] ---末無空格、異於用戶詞庫中之custom_code
function M.seekCodesOfChars(db, chars, inputCodes)
	local codes_2dArr = M.seekCodesOfChars_2dArr(db, chars, inputCodes)
	return algo.combineStr2dArr(codes_2dArr)
end

--- "睡覺" -> ['shui jiao', 'shui jue']
---@param db ReverseDb
---@param str string
---@param inputCodes string[]|nil
---@return string[]
function M.seekCodesOfStr(db, str, inputCodes)
	local chars = ut.splitString(str, '')
	local ans = M.seekCodesOfChars(db, chars, inputCodes)
	return ans
end



M.fullShapes = {}

M.fullShapes.half__full_upper_arr = {
	{'A','Ａ'},
	{'B','Ｂ'},
	{'C','Ｃ'},
	{'D','Ｄ'},
	{'E','Ｅ'},
	{'F','Ｆ'},
	{'G','Ｇ'},
	{'H','Ｈ'},
	{'I','Ｉ'},
	{'J','Ｊ'},
	{'K','Ｋ'},
	{'L','Ｌ'},
	{'M','Ｍ'},
	{'N','Ｎ'},
	{'O','Ｏ'},
	{'P','Ｐ'},
	{'Q','Ｑ'},
	{'R','Ｒ'},
	{'S','Ｓ'},
	{'T','Ｔ'},
	{'U','Ｕ'},
	{'V','Ｖ'},
	{'W','Ｗ'},
	{'X','Ｘ'},
	{'Y','Ｙ'},
	{'Z','Ｚ'}
}

M.fullShapes.half__full_lower_arr = {
	{'a','ａ'},
	{'b','ｂ'},
	{'c','ｃ'},
	{'d','ｄ'},
	{'e','ｅ'},
	{'f','ｆ'},
	{'g','ｇ'},
	{'h','ｈ'},
	{'i','ｉ'},
	{'j','ｊ'},
	{'k','ｋ'},
	{'l','ｌ'},
	{'m','ｍ'},
	{'n','ｎ'},
	{'o','ｏ'},
	{'p','ｐ'},
	{'q','ｑ'},
	{'r','ｒ'},
	{'s','ｓ'},
	{'t','ｔ'},
	{'u','ｕ'},
	{'v','ｖ'},
	{'w','ｗ'},
	{'x','ｘ'},
	{'y','ｙ'},
	{'z','ｚ'}
}

M.fullShapes.half__full_number_arr = {
	{'0','０'},
	{'1','１'},
	{'2','２'},
	{'3','３'},
	{'4','４'},
	{'5','５'},
	{'6','６'},
	{'7','７'},
	{'8','８'},
	{'9','９'}
}

M.fullShapes.half__full_symbol_arr = {
	{'+','＋'},
	{'-','－'},
	{'*','＊'},
	{'/','／'},
	{'=','＝'},
	{'%','％'},
	{'$','＄'},
	{'&','＆'},
	{'@','＠'},
	{'#','＃'},
	{'!','！'},
	{'?','？'},
	{'^','＾'},
	{'_','＿'},
	{'(','（'},
	{')','）'},
	{'[','［'},
	{']','］'},
	{'{','｛'},
	{'}','｝'},
	{'<','＜'},
	{'>','＞'},
	{'|','｜'},
	{'.','．'},
	{',','，'},
	{':','：'},
	{';','；'},
	{'\'','＇'},
	{'"','＂'},
	{'`','｀'},
	{'\\','＼'}
}

M.fullShapes.half__full_space_arr = {
	{' ', '　'}
}

M.fullShapes.half__full_arr = {}
ut.insertUnpack(
	M.fullShapes.half__full_arr
	,{M.fullShapes.half__full_lower_arr
	, M.fullShapes.half__full_upper_arr
	, M.fullShapes.half__full_number_arr
	, M.fullShapes.half__full_symbol_arr
	, M.fullShapes.half__full_space_arr}
)

M.fullShapes.half__full = ut.map(M.fullShapes.half__full_arr)
return M