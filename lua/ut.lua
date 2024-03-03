local M = {}

---@generic T
---@param v T|nil
---@param err string|nil
---@return T
local function nn(v, err)
    if v == nil then
		if err == nil then
			err = ''
		end
        -- if type(err) == "string" then
        --     error(err, 1)
        -- else
        --     error(err, 1)
        -- end
		error(err, 1)
    end
    return v
end
M.nn=nn

-- ---@param str string
-- ---@return string[]
-- local function stringToCharArray(str)
-- 	local charArray = {}  -- 创建一个空数组
-- 	for i=1, string.len(str) do
-- 	  charArray[i] = string.sub(str, i, i)  -- 将字符串中的每个字符存入数组
-- 	end
-- 	return charArray
-- end


---@param str string
---@return string[]
function M.strTocharArr(str)
	local ans = {}
	for i = 1, utf8.len(str)do
		ans[i] = M.utf8_sub(str, i, i)
	end
	return ans
end

---AI: 在最坏的情况下，时间复杂度可以达到O(n*m)，其中n是输入字符串的长度，m是分隔符的长度。
---@param inputStr string
---@param sep string
---@return string[]
function M.splitString(inputStr, sep)
	if sep == '' then
		return M.strTocharArr(inputStr)
	end
	local result = {}
	local pattern = "(.-)" .. sep
	local lastEnd = 1
	local s, e, part = inputStr:find(pattern, 1)
	while s do
		table.insert(result, part)
		lastEnd = e + 1
		s, e, part = inputStr:find(pattern, lastEnd)
	end
	table.insert(result, inputStr:sub(lastEnd))
	return result
end





--- func desc
---@param v any
local function logWarnStr(v)
	if type(v) == "string" then
		log.warning(v)
	else
		log.warning(tostring(v))
	end
end
M.logWarnStr = logWarnStr


local json = require("_ut/ison")

local function stringfy(v)
	---@param t string
	local function formatType(t)
		return t
	end
	local ty = type(v)
	if ty == "string" then
		return v
	elseif ty == "number" or ty == "table" or ty == "boolean" then
		return(json.encode(v, formatType))
	else
		--log.warning('<'..ty..'>')
		return(ty)
	end
end

M.stringfy = stringfy

--- func desc
---@param v any
function M.logWarnJson(v)
	log.warning(stringfy(v))
end

function M.time()
	return os.date("%Y-%m-%dT%H:%M:%S")
end



---@param file file
---@param v any
function M.write(file, v)
	local str = stringfy(v)
	file:write(v)
end



-- function M.short_src()
-- 	return debug.getinfo(1, "S").short_src
-- end

-- function M.dirName_fn()
-- 	return function ()
-- 		local fullPath = debug.getinfo(1, "S").short_src
-- 		local levels = M.splitString(fullPath, '[/\\]')
-- 		Wat(levels)
-- 		local ans = ''
-- 		for i,k in ipairs(levels)do
-- 			ans = ans..k..'/'
-- 			if i==#levels-1 then
-- 				break
-- 			end
-- 		end
-- 		return ans
-- 	end
-- end

---@param filePath string
function M.resolveDir(filePath)
	local levels = M.splitString(filePath, '[/\\]')
	local ans = ''
	for i,k in ipairs(levels)do
		ans = ans..k
		if i<=#levels-2 then
			ans = ans..'/'
		end
		if i==#levels-1 then
			break
		end
	end
	return ans
end

---nullish coalescing
---@generic T
---@generic U
---@param a T|nil
---@param b U
---@return T|U
function M.nc(a,b)
	if a == nil then
		return b
	end
	return a
end


-- --- func
-- ---@param obj table
-- ---@param depth number
-- ---@return string
-- function M.inspect(obj, depth)
--     depth = depth or 0
--     local indent = string.rep("  ", depth)
--     local result = ""

--     if type(obj) == "table" then
--         result = result .. "{\n"
--         for k, v in pairs(obj) do
--             result = result .. indent .. "  " .. tostring(k) .. ": " .. inspect(v, depth + 1) .. ",\n"
--         end
--         result = result .. indent .. "}"
--     else
--         result = tostring(obj)
--     end

--     return result
-- end



---@param s string
---@param i integer
---@param j integer
---@return string|nil
function M.utf8_sub(s, i, j)
	i = i or 1
	j = j or -1

	if i < 1 or j < 1 then
	local n = utf8.len(s)
	if not n then return nil end
	if i < 0 then i = n + 1 + i end
	if j < 0 then j = n + 1 + j end
	if i < 0 then i = 1 elseif i > n then i = n end
	if j < 0 then j = 1 elseif j > n then j = n end
	end

	if j < i then return "" end

	i = utf8.offset(s, i)
	j = utf8.offset(s, j + 1)

	if i and j then
	return s:sub(i, j - 1)
	elseif i then
	return s:sub(i)
	else
	return ""
	end
end

---@generic T
---@param arr T[]
---@return T[]
function M.shallowCopyArr(arr)
	local ans = {}
	for i,v in ipairs(arr)do
		ans[i] = v
	end
	return ans
end


---@param o1 table
---@param o2 table 優先級更高
function M.toDeepMerge(o1, o2)
	if not o1 then
		error('table1 is nil')
	end
	local toDeepMerge = M.toDeepMerge
	local ans = {}

	for k,v in pairs(o1) do
		local typeO1K = type(o1[k])
		if typeO1K == 'table' and type(o2[k]) == 'table' then
			ans[k] = toDeepMerge(o1[k], o2[k]) -- Recursively merge sub-tables
		elseif o2[k] ~= nil then
			ans[k] = o2[k] -- Override values from o1 with values from o2
		else
			ans[k] = v -- Preserve values from o1 if not overridden by o2
		end
	end
	
	-- Merge any additional key-value pairs from o2
	for k,v in pairs(o2) do
		if o1[k] == nil then
			ans[k] = v
		end
	end

	return ans
	-- local table1 = o2 or {}
	-- local table2 = o1 --沒寫反
	-- local stack = {{table1, table2}}
	-- local merged = {}

	-- while #stack > 0 do
	-- 	local t1, t2 = table.unpack(table.remove(stack))

	-- 	for k, v in pairs(t1) do
	-- 		if type(v) == "table" and t2[k] and type(t2[k]) == "table" then
	-- 			table.insert(stack, {v, t2[k]})
	-- 		else
	-- 			merged[k] = v
	-- 		end
	-- 	end

	-- 	for k, v in pairs(t2) do
	-- 		if not merged[k] then
	-- 			merged[k] = v
	-- 		end
	-- 	end
	-- end

	-- return merged
end



return M