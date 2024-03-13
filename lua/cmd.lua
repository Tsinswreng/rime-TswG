--[[ 

需:
recognizer:
  patterns:
    cmd: "^\\$.+$"

在vscode中輸出\t旹可能觸發vscode代碼補全

 ]]

local ut = require("ut")
local config = require('config').default
local shared = require('shared')
local clipboard = require('clipboard')
local algo = require('algo')
local rimeUt = require('rimeUtil')
local M = {}
M.processor = {}
local prompt = '$' ---須在speller/alphabet中
local paramSplit = ','
local ready = false

local getText = clipboard.saveEtRead


-- local str = '離離原上草一歲一枯榮野火燒不盡春風吹又生遠芳侵古道晴翠接荒城又送王孫去淒淒滿別情'
-- local arr = ut.splitString(str, '')
-- local t = algo.charArrToVertical_right(arr, {
-- 	colMax = 5
-- 	,maxCols = 4
-- 	,alternate = '〇'
-- 	,colDelimiter = '\t'
-- 	,paraDelimiter = '\n\n'
-- })

-- Wat('\n'..t)



---@param str string
---@param delimiter string
---@return string[] '114,514,810,893' -> ['114', '514,810,893']
local function splitByFirstDelimiter(str, delimiter)
	local pos_delimiter---@type integer
	local len = utf8.len(str)
	for i = 1, len do
		local char = ut.utf8_sub(str, i, i)
		if char == delimiter then
			pos_delimiter = i
			break
		end
	end
	if not pos_delimiter then
		return {str}
	end
	local left = ut.utf8_sub(str, 1, pos_delimiter-1)
	local right = ut.utf8_sub(str, pos_delimiter+1, len)
	return {left, right}
end



---@param env Env
local function init(env)
	local id = env.engine.schema.schema_id
	config = shared.loadConfig(id)
	prompt = config.cmd.prompt
	paramSplit = config.cmd.paramSplitter
end


---@param str string
---@param head string
local function removeHeadChar(str, head)
	local ans = string.sub(str, 1+#head, #str)
	return ans
end

---@param env Env
function M.processor.init(env)
	init(env)
end



local cmd__react = {}
---關 簡體
---@param env Env
cmd__react['S'] = function (env)
	return function ()
		local ctx = env.engine.context
		ctx:set_option('simplification', false)
		ctx:clear()
	end
end
---開 簡體
---@param env Env
cmd__react['s'] = function (env)
	return function ()
		local ctx = env.engine.context
		ctx:set_option('simplification', true)
		ctx:clear()
	end
end

---開 日本新字體
---@param env Env
cmd__react['jp'] = function (env)
	return function ()
		local switchName = config.jp.switchName
		local ctx = env.engine.context
		ctx:set_option(switchName, true)
		ctx:clear()
	end
end

cmd__react['Jp'] = function (env) ---@param env Env
	return function ()
		local switchName = config.jp.switchName
		local ctx = env.engine.context
		ctx:set_option(switchName, false)
		ctx:clear()
	end
end

---開 聯想
---@param env Env
cmd__react['p'] = function (env)
	return function ()
		local switchName = config.predict.switchName
		local ctx = env.engine.context
		ctx:set_option(switchName, true)
		ctx:clear()
	end
end

cmd__react['P'] = function (env) ---@param env Env
	return function ()
		local switchName = config.predict.switchName
		local ctx = env.engine.context
		ctx:set_option(switchName, false)
		ctx:clear()
	end
end

--- 全角 開
cmd__react['fu'] = function (env) ---@param env Env
return function ()
	local switchName = 'full_shape'
	local ctx = env.engine.context
	ctx:set_option(switchName, true)
	ctx:clear()
end
end

--- 全角 關
cmd__react['Fu'] = function (env) ---@param env Env
return function ()
	local switchName = 'full_shape'
	local ctx = env.engine.context
	ctx:set_option(switchName, false)
	ctx:clear()
end
end

---權重提示 開
---@param env Env
cmd__react['q'] = function (env)
	return function ()
		local ctx = env.engine.context
		local switchName = config.qualityHint.switchName
		ctx:set_option(switchName, true)
		ctx:clear()
	end
end

---權重提示 關
---@param env Env
cmd__react['Q'] = function (env)
	return function ()
		local ctx = env.engine.context
		local switchName = config.qualityHint.switchName
		ctx:set_option(switchName, false)
		ctx:clear()
	end
end


---由十六進制碼輸出unicode u,4e2d -> '中'
---@param env Env
---@param param string
cmd__react['u'] = function (env, param)
	return function ()
		local hex = tonumber(param, 16)
		local unicodeChar = utf8.char(hex)
		env.engine:commit_text(unicodeChar)
		local ctx = env.engine.context
		ctx:clear()
	end
end

---@param env Env
---@param param string
cmd__react['l'] = function (env, param)
	return function ()
		local fn = load('return '..param)
		local ans = fn()
		env.engine:commit_text(ans)
		local ctx = env.engine.context
		ctx:clear()
		--ctx:push_input(ans)
	end
end


---@param env Env
---@param param string
cmd__react['v'] = function (env, param)
	return function ()
		local cb = clipboard.saveEtRead() or ''
		cb = algo.escapeStrToCommit(cb)
		local tail = '.json'
		if param then
			local jsonPath = param..tail
			local opencc = Opencc(jsonPath)
			cb = opencc:convert(cb)
		end
		env.engine:commit_text(cb)
		local ctx = env.engine.context
		ctx:clear()
	end
end

---@param env Env
---@param param string
cmd__react['cb'] = function (env, param)
	return function ()
		if param == 's' then
			clipboard.save()
		elseif param == 'r' then
			local cb = clipboard.read()
			cb = algo.escapeStrToCommit(cb)
			env.engine:commit_text(cb)
		end
		local ctx = env.engine.context
		ctx:clear()
	end
end

---@param env Env
---@param param string
cmd__react['f'] = function (env, param)
	
	---@param charArr string[]
	local function toFull_charArr(charArr)
		for i,char in ipairs(charArr)do
			local full = rimeUt.fullShapes.half__full[char]
			if full then
				charArr[i] = full
			end
		end
		return charArr
	end

	---@param str string
	local function toFull_str(str)
		local charArr = ut.splitString(str, '')
		for i,char in ipairs(charArr)do
			local full = rimeUt.fullShapes.half__full[char]
			if full then
				charArr[i] = full
			end
		end
		return ut.joinString(charArr)
	end

	
	---@param cb string
	---@param sp string[]
	local function du(cb, sp)
		local colMaxStr = assert(sp[2])
		local colMax = assert(tonumber(colMaxStr))
		local maxCols = tonumber(sp[3]) ---@type integer|nil
		cb = rime_api.regex_replace(cb, '(\r|\n|\r\n)', ' ')
		local charArr = ut.splitString(cb, '')
		local ans = algo.charArrToVertical_right(charArr, {
			colMax = colMax
			,maxCols = maxCols
			,alternate = '　'
			,colDelimiter = '\t'
			,paraDelimiter = '\n\n\n'
		})
		--local ans = algo.strToVertical_right_deprecated(cb, colMax, '　', '\t', '\r')
		ans = algo.escapeStrToCommit(ans)
		return ans
	end
	
	return function ()
		local cb = getText() or ''
		local sp = ut.splitString(param, ',')
		local mode = assert(sp[1])
		if mode == 'vr' then
			local ans = du(cb, sp)
			env.engine:commit_text(ans)
			local ctx = env.engine.context
			ctx:clear()
			return
		end
		if mode == 'vrf' then
			local ans = du(cb, sp)
			ans = toFull_str(ans)
			env.engine:commit_text(ans)
			local ctx = env.engine.context
			ctx:clear()
			return
		end
	end
end

---@param env Env
---@param paramStr string
cmd__react['fv'] = function (env, paramStr)
	local fn = cmd__react['f']
	local d = config.cmd.paramSplitter
	local param
	if not paramStr then
		param = {'4',''}
	else
		param = ut.splitString(paramStr, d)
	end
	
	local defaultColMax = 4
	local colMax = defaultColMax
	local paNum = tonumber(param[1])
	if paNum ~= nil then
		colMax = paNum
	end
	local maxCols = tonumber(param[2]) or ''

	local cmd_ = 'vrf'..d..colMax..d..maxCols
	return fn(env, cmd_)
end

---@param env Env
---@param param string
cmd__react['r'] = function (env, param)
	return function ()
		local cb = clipboard.saveEtRead() or ''
		-- local chars = {} ---@type string[]
		-- for i, code in utf8.codes(cb)do
		-- 	local char = utf8.char(code)
		-- 	table.insert(chars, char)
		-- end
		local chars = ut.splitString(cb, '')
		local ans = ''
		for i = #chars, 1, -1 do
			local char = chars[i]
			if char == '\n' then
				char = '\r'
			end
			ans = ans .. char
			--Wat({char, ans})
		end
		env.engine:commit_text(ans)
		local ctx = env.engine.context
		ctx:clear()
	end
end

-- cmd__react['i'] = function (env, param)
-- 	local i = 0
-- 	return function ()
-- 		env.engine:commit_text(i)
-- 		local ctx = env.engine.context
-- 		ctx:clear()
-- 		i = i + 1 叵
-- 	end
-- end



local execute ---@type function --- 響應函數
local outerFn ---@type function
function M.processor.func(key, env) ---@type ProcessorFn
	local ctx = env.engine.context
	--Wat(shared.config)
	--Wat(key:repr())
	local isAsciiMode = ctx:get_option('ascii_mode')
	if isAsciiMode then
		return 2
	end
	-- if not key.keycode == 36 then --$
	-- 	return 2
	-- end
	
	
	if config.cmd.useSpace and key.keycode == 32 then
		local checkPrompt = string.sub(ctx.input, 1, #prompt)
		
		if checkPrompt ~= prompt then
			return 2
		end
		ctx:push_input(' ')
		return 1
	end

	if config.cmd.submitKey(key) then
		local checkPrompt = string.sub(ctx.input, 1, #prompt)
		
		if checkPrompt ~= prompt then
			return 2
		end
		local cmdBody = removeHeadChar(ctx.input, prompt)
		local split = splitByFirstDelimiter(cmdBody, paramSplit)
		local cmdName = split[1]
		local param = split[2] ---@type string|nil
	
		outerFn = cmd__react[cmdName]
		if outerFn then
			execute = outerFn(env, param)
		else
			log.error(ctx.input..'\nno such command')
			return 2
		end
		if execute then
			ready = true
		else
			--Wat('no such command')
		end
		if ready then
			if execute then
				execute(env)
				ready = false
				return 1
			else
				log.error('no react')
			end
			ready = false
		else
			
		end
		return 2
	end


	return 2
	
end

return M