--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local M = {}
M.processor = {}
local shared = require('shared')
local env_ = require('env_')

---@param env Env
function M.processor.init(env)
	--Wat(env.engine.schema.schema_id)
	--Wat(env.engine.schema.schema_name)
	env_.init()
	shared.loadConfig(env.engine.schema.schema_id)

end

function M.processor.func(key, env)
	return 2
end

return M