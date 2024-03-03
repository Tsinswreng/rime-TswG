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




return M