--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local M = {}
M.filter = {}
local candLimit = 64

function M.filter.init(env)
	
end

function M.filter.func(trans, env)---@type FilterFn
	local i = 1
	for cand in trans:iter()do
		if i > candLimit then
			break
		end
		yield(cand)
		i = i + 1
	end
end

return M