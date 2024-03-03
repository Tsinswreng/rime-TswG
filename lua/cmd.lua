--[[ 

需:
recognizer:
  patterns:
    cmd: "^\\$.+$"

 ]]

local ut = require("ut")
local config = require('config').default
local shared = require('shared')
local M = {}
M.processor = {}
local prompt = '$' ---須在speller/alphabet中
local paramSplit = ','
local ready = false



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



-- cmd__react['i'] = function (env, param)
-- 	local i = 0
-- 	return function ()
-- 		env.engine:commit_text(i)
-- 		local ctx = env.engine.context
-- 		ctx:clear()
-- 		i = i + 1 叵
-- 	end
-- end


local react ---@type function --- 響應函數
local outerFn ---@type function
function M.processor.func(key, env) ---@type ProcessorFn
	
	local ctx = env.engine.context
	--Wat(shared.config)
	local isAsciiMode = ctx:get_option('ascii_mode')
	if isAsciiMode then
		return 2
	end
	-- if not key.keycode == 36 then --$
	-- 	return 2
	-- end

	if key.keycode == 32 then
		
		local checkPrompt = string.sub(ctx.input, 1, #prompt)
		
		if checkPrompt ~= prompt then
			return 2
		end
		local cmdBody = removeHeadChar(ctx.input, prompt)
		local split = ut.splitString(cmdBody, paramSplit)
		local cmdName = split[1]
		local param = split[2] ---@type string|nil
	
		outerFn = cmd__react[cmdName]
		if outerFn then
			react = outerFn(env, param)
		else
			log.error(ctx.input..'\nno such command')
			return 2
		end
		if react then
			ready = true
		else
			--Wat('no such command')
		end
		if ready then
			if react then
				react(env)
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