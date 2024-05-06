local M = {}
M.filter = {}
M.switchName = 'hint_quality'
local shared = require('shared')
local config = shared.config

local s2t = Opencc('s2t.json')
local t2s = Opencc('t2s.json')
 
---@param env Env
function M.filter.init(env)
	config = shared.loadConfig(env.engine.schema.schema_id)
	M.switchName = config.qualityHint.switchName
end


function M.filter.func(trans, env) ---@type FilterFn
	local ctx = env.engine.context
	local isOn = ctx:get_option(M.switchName)
	if not isOn then
		for cand in trans:iter()do
			yield(cand)
		end
		return
	end
	for ori_cand in trans:iter()do
		local neoCand = ori_cand
		--cand.comment = cand.comment..'-'..tradChar 似不可改
		neoCand = Candidate(
			ori_cand.type
			,ori_cand.start
			,ori_cand._end
			,ori_cand.text
			,ori_cand.comment..ori_cand.quality
		)
		neoCand.quality = ori_cand.quality
		neoCand.preedit = ori_cand.preedit
		::continue::
		yield(neoCand)
	end
end

return M