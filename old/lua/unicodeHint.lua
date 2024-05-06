local M = {}
M.filter = {}

function M.filter.init(env)
	
end

function M.filter.func(trans, env)---@type FilterFn
	for cand in trans:iter() do
		if utf8.len(cand.text) == 1 then
			local char = cand.text
			local utf8Bytes = {utf8.codepoint(char)}
			local hexStr = ''
			for _, codepoint in ipairs(utf8Bytes) do
				--Wat(string.format("Unicode 码: U+%04X", codepoint))
				local uHexStr = string.format("%04X", codepoint)
				hexStr = hexStr .. uHexStr
			end
			cand.comment = hexStr
		end
		yield(cand)
	end
end

return M