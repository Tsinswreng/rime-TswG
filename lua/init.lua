local M = {}
M.processor = {}
local shared = require('shared')


---@param env Env
function M.processor.init(env)
	--Wat(env.engine.schema.schema_id)
	--Wat(env.engine.schema.schema_name)
	shared.loadConfig(env.engine.schema.schema_id)

end

function M.processor.func(key, env)
	return 2
end

return M