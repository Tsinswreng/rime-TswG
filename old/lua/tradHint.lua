--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local rimeUt = require "rimeUtil"
local M = {}

M.filter = {}

local s2t = Opencc('s2t.json')
local t2s = Opencc('t2s.json')
function M.filter.init(env)
	
end


function M.filter.func(trans, env) ---@type FilterFn
	local ctx = env.engine.context
	local isSimp = ctx:get_option('simplification')
	if not isSimp then
		rimeUt.yieldAllTrans(trans)
	end
	for ori_cand in trans:iter()do
		local neoCand = ori_cand
		local tradChar = ori_cand.text
		local simpChar = t2s:convert(tradChar)
		--Wat(tradChar)
		if tradChar == simpChar then
			goto continue
		end
		--cand.comment = cand.comment..'-'..tradChar 似不可改
		-- neoCand = Candidate(
		-- 	ori_cand.type
		-- 	,ori_cand.start
		-- 	,ori_cand._end
		-- 	,simpChar
		-- 	,ori_cand.comment..'-'..tradChar
		-- )
		-- neoCand.quality = ori_cand.quality
		-- neoCand.preedit = ori_cand.preedit
		neoCand.comment = ori_cand.comment..'-'..tradChar
		::continue::
		yield(neoCand)
	end
end

return M