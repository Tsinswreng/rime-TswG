local rimeUt = require "rimeUtil"
local M = {}
M.filter = {}
local t2s = Opencc('t2s.json')


---@param env Env
function M.filter.init(env)
	
end


function M.filter.func(trans, env)---@type FilterFn
	local ctx = env.engine.context
	local isOn = ctx:get_option('simplification')
	if not isOn then
		rimeUt.yieldAllTrans(trans)
		return
	end
	for cand in trans:iter()do
		local neoText = t2s:convert(cand.text)
		local sha = ShadowCandidate(cand, cand.type, neoText, cand.comment)

		yield(sha)
	end
end

return M