--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local ut = require('ut')
local M = {}


---@param arr any[]
local function shallowCopy(arr)
	local ans = {}
	for i,v in ipairs(arr)do
		ans[i] = v
	end
	return ans
end

--- 等號左邊減一或右邊加一
---@generic T
---@param arr T[][]
---@return T[][]
function M.arrCombination(arr)
	if #arr == 0 then
		return {}
	end
	local pos = {} ---@type integer[]
	for i,v in ipairs(arr)do
		if #v == 0 then
			return {}
		end
		pos[i] = 0+1
	end
	local ans = {}
	local stack = {}
	local i = 0+1
	local ipp = false
	while true do
		table.insert(stack, arr[i][pos[i]])
		ipp = true
		if #stack == #arr then
			table.insert(ans, shallowCopy(stack))
			if #stack == 0 then
				return ans
			end
			table.remove(stack)
			pos[i] = pos[i]+1
			ipp = false
		end
		if pos[i]-1 == #arr[i] then
			while i>=1 do
				if pos[i]+1-1 >= #arr[i] then
					pos[i] = 0+1
					i = i-1
					if #stack == 0 then
						return ans
					end
					table.remove(stack)
				else
					pos[i] = pos[i] + 1
					break
				end
			end
			ipp = false
		end
		if ipp then
			i = i+1
		end
	end
	return ans
end


---@param arr string[]
---@return string[]
function M.abc_to_c_cb_cbaStr(arr)
	local ans = {} ---@type string[]
	for i,v in ipairs(arr)do
		if i == 1 then
			table.insert(ans, v)
		else
			local e = ans[i-1]
			e = v..e
			table.insert(ans, e)
		end
	end
	return ans
end


---@param arr string[]
---@return string[]
function M.abc_to_a_ab_abcStr(arr)
	local ans = {} ---@type string[]
	for i,v in ipairs(arr)do
		if i == 1 then
			table.insert(ans, v)
		else
			local e = ans[i-1]
			e = e..v
			table.insert(ans, e)
		end
	end
	return ans
end

---@generic T
---@param arr T[] [a, b, c]
---@return T[][] [[a], [a,b], [a,b,c] ]
function M.abc_to_a_ab_abc(arr)
	local ans = {} ---@type T[][]
	for i,v in ipairs(arr)do
		if i == 1 then
			table.insert(ans, {v})
		else
			local e = ans[i-1]
			e = ut.shallowCopyArr(e)
			table.insert(e, v)
			table.insert(ans, e)
		end
	end
	return ans
end


---@generic T
---@param arr T[] [a, b, c]
---@return T[][] [[c], [b,c], [a,b,c] ]
function M.abc_to_c_bc_abc(arr)
	local result = {}
	for i = #arr, 1, -1 do
	  local subarr = {}
	  for j = i, #arr do
		table.insert(subarr, arr[j])
	  end
	  table.insert(result, subarr)
	end
	return result
end

-- Wat('i: '..i)
-- --Wat('arr[i]: '..arr[i])
-- Wat('pos[i]: '..pos[i])
-- Wat('pos: ')
-- Wat(pos)
-- --Wat('arr: ')
-- --Wat(arr)
-- Wat('Wat(arr[i][pos[i]])')
-- Wat(arr[i][pos[i]])
-- table.insert(stack, arr[i][pos[i]])
-- Wat('stack')
-- Wat(stack)
-- log.error('---')


---@param a string
---@param b string
---@return boolean
function M.isAPrefixOfB(a,b)
	local inputCode = a
	local gotCode = b
	local inputCodeLen = utf8.len(inputCode)
	if inputCodeLen == nil then
		return false
	end
	local gotCodeSub = ut.utf8_sub(gotCode, 1, inputCodeLen)
	if gotCodeSub == inputCode then
		return true
	end
	return false
end





---[['shui'], ['jiao', 'jue']] -> ['shui jiao','shui jue']
---@param str2dArr string[][] [['shui'], ['jiao', 'jue']] from getCodes2dArr
---@return string[] ---末無空格、異於用戶詞庫中之custom_code
function M.combineStr2dArr(str2dArr)
	local comb = M.arrCombination(str2dArr) -- [['shui','jiao'],['shui','jue']]
	local ans = {} ---@type string[]
	for i,v in ipairs(comb)do
		local ua = table.concat(v, ' ')
		--ua = ua..' ' --末添空格
		ans[i] = ua
	end
	return ans
end



---@param str string
function M.escapeStrToCommit(str)
	local chars = ut.splitString(str, '')
	local ans = ''
	for i, char in ipairs(chars)do
		if char == '\n' then
			char = '\r'
		end
		ans = ans .. char
	end
	return ans
end

-- ---@generic T
-- ---@param arr2d T[][]
-- ---@param alternate T
-- function M.replenish2dArr(arr2d, alternate)
	
-- end

---@generic T
---@param arr T[]
---@param max integer 每組最多之成員數
---@param alternate T|nil 可選 用于補齊末ᵗ組
function M.groupArrTo2dArr(arr, max, alternate)
	local arr2d = {}
	local ua = {} ---@type T[]
	for i, u in ipairs(arr)do
		table.insert(ua, u)
		if #ua == max or i == #arr then
			table.insert(arr2d, ua)
			ua = {}
		end
	end
	if alternate then
		---@generic T
		---@param groups T[][]
		---@param alternate T
		---@return T[][]
		local function replenish(groups, alternate)
			local lastIndex = #groups
			local last = groups[lastIndex]
			if #last < #groups[1] then
				local diff = #groups[1] - #last
				for i = 1, diff do
					table.insert(last, alternate)
					if #last == #groups[1]then
						break
					end
				end
			end
			groups[lastIndex] = last
			return groups
		end
		arr2d = replenish(arr2d, alternate)
	end
	return arr2d
end

--[[ 
local t = {1,2,3,4,5,6,7}
algo.reverseLocal(t)
Wat(t)
 ]]
---就地逆序
---@generic T
---@param arr T[]
function M.reverseLocal(arr)
	local j = #arr
	for i,v in ipairs(arr)do
		arr[i] = arr[j]
		arr[j] = v
		if i > #arr / 2 - 1 then
			break
		end
		j = j - 1
	end
	return arr
end


---二維列表轉置
---@generic T
---@param matrix T[][] 勿有nil
function M.transpose(matrix)
	local ans = {} ---@type T[][]
	if #matrix == 0 then
		return {}
	end
	local cols = #matrix[1]
	for i = 1, cols do
		ans[i] = {}
	end

	for i,row in ipairs(matrix)do
		for j, ele in ipairs(row)do
			--local ele = matrix[i][j]
			ans[j][i] = ele
		end
	end
	return ans
end

---s='白日依山盡黃河入海流欲窮千里目更上一層樓一二三四五六七'; (s, 5, '0') ->
---[["白","黃","欲","更","一","六"],["日","河","窮","上","二","七"],["依","入","千","一","三","0"],["山","海","里","層","四","0"],["盡","流","目","樓","五","0"]]
---@param str string
---@param colMax integer
---@param alternate string
function M.groupEtTransposeStr(str, colMax, alternate)
	local charArr = ut.splitString(str, '')
	local groups = M.groupArrTo2dArr(charArr, colMax)
	local lastIndex = #groups
	local last = groups[lastIndex]
	if #last < #groups[1] then
		local diff = #groups[1] - #last
		for i = 1, diff do
			table.insert(last, alternate)
			if #last == #groups[1]then
				break
			end
		end
	end
	groups[lastIndex] = last
	local transposed = M.transpose(groups)
	return transposed
end



---轉豎排 右嚮左換行 不支持分段
---@param str string
---@param colMax integer 每行字數
---@param colDelimiter string 行分隔符
---@param alternate string 㕥代空
---@param newLine string 換行符
function M.strToVertical_right_deprecated(str, colMax, alternate, colDelimiter, newLine)
	local transposed = M.groupEtTransposeStr(str, colMax, alternate)
	for i,v in ipairs(transposed)do
		M.reverseLocal(transposed[i])
	end

	local ans = ''
	for i,v in ipairs(transposed)do
		for j, char in ipairs(v)do
			ans = ans .. char
			if j < #v then
				ans = ans..colDelimiter
			end
		end
		if i < #transposed then
			ans = ans.. newLine
		end
	end
	return ans
end



-- local colMax = opt.colMax or 4 ---@type integer 每列最多字符數
-- local maxCols = opt.maxCols ---@type integer|nil 每段最多列數
-- local alternate = opt.alternate or '' ---@type string 字符誧替補
-- local colDelimiter = opt.colDelimiter or '' ---@type string 列分隔
-- local paraDelimiter = opt.paraDelimiter or '\n' ---@type string 段落分隔
-- local newLine = opt.newLine or '\n' ---@type string 換行符
-- local processFn = opt.processFn ---@type fun(charArr:string[]):string[] 預處理函數
---@param charArr string[]
---@param opt table
---@return string
function M.charArrToVertical_right(charArr, opt)

	local colMax = opt.colMax or 4 ---@type integer 每列最多字符數
	local maxCols = opt.maxCols ---@type integer|nil 每段最多列數
	local alternate = opt.alternate or '' ---@type string 字符誧替補
	local colDelimiter = opt.colDelimiter or '' ---@type string 列分隔
	local paraDelimiter = opt.paraDelimiter or '\n' ---@type string 段落分隔
	local newLine = opt.newLine or '\n' ---@type string 換行符
	local processFn = opt.processFn ---@type fun(charArr:string[]):string[] 預處理函數




	---轉豎排 右嚮左換行 不支持分段
	---@param charArr string[]
	---@param colMax integer 每行字數
	---@param colDelimiter string 行分隔符
	---@param alternate string 㕥代空
	---@param newLine string 換行符
	---@return string
	local function charArrToVertical_right_singlePara(charArr, colMax, alternate, colDelimiter, newLine)
		--local transposed = M.groupEtTransposeStr(str, colMax, alternate)
		local char2dArr = M.groupArrTo2dArr(charArr, colMax, alternate)
		local transposed = M.transpose(char2dArr)
		for i,v in ipairs(transposed)do
			M.reverseLocal(transposed[i])
		end

		local ans = ''
		for i,v in ipairs(transposed)do
			for j, char in ipairs(v)do
				ans = ans .. char
				if j < #v then
					ans = ans..colDelimiter
				end
			end
			if i < #transposed then
				ans = ans.. newLine
			end
		end
		return ans
	end


	if processFn then
		charArr = processFn(charArr)
		
	end
	assert(charArr)
	if #charArr == 0 then
		return ''
	end

	if not maxCols then
		local ans = charArrToVertical_right_singlePara(charArr, colMax, alternate, colDelimiter, newLine)
		return ans
	end

	local paraMaxCharCnt = colMax * maxCols
	local paras_2dArr = {} ---@type string[][]
	paras_2dArr = M.groupArrTo2dArr(charArr, paraMaxCharCnt) ---@type string[][]

	local paras_arr = {} ---@type string[]
	for i,charArr in ipairs(paras_2dArr)do
		local ua = charArrToVertical_right_singlePara(charArr, colMax, alternate, colDelimiter, newLine)
		paras_arr[i] = ua
	end

	local ans = ''
	for i,paraStr in ipairs(paras_arr)do
		ans = ans .. paraStr
		if i < #paras_arr then
			ans = ans..paraDelimiter
		end
	end
	return ans
end

--[[ 

離離原上草
一歲一枯榮
野火燒不盡
春風吹又生
遠芳侵古道
晴翠接荒城
又送王孫去
淒淒滿別情

$v,vrf,6
淒	又	晴	遠	春	野	一	離
淒	送	翠	芳	風	火	歲	離
滿	王	接	侵	吹	燒	一	原
別	孫	荒	古	又	不	枯	上
情	去	城	道	生	盡	榮	草
　	　	　	　	　	　	　	　

春	野	一	離
風	火	歲	離
吹	燒	一	原
又	不	枯	上
生	盡	榮	草


淒	又	晴	遠
淒	送	翠	芳
滿	王	接	侵
別	孫	荒	古
情	去	城	道
　	　	　	　


白日依山盡
黃河入海流
欲窮千

欲	黃	白
窮	河	日
千	入	依
	海	山
	流	盡

 ]]


return M