local M = {}
M.translator = {}
M.filter = {}

local mem---@type Memory
local t2s = Opencc('t2s.json')
local limit = 16 ---$


function M.translator.init(env)
	mem = Memory(env.engine, env.engine.schema)
end

function M.translator.func(input, seg, env)---@type TranslatorFn
	local ctx = env.engine.context
	local cnt = 0
	-- for cand in trans:iter() do
	-- 	yield(cand)
	-- 	cnt = cnt + 1
	-- end
	mem:user_lookup(ctx.input, true)
	--local phrases = {} ---@type Phrase[]
	local additionalCands = {} ---@type Candidate[]
	local i = 1
	for de in mem:iter_user() do
		-- if i > limit then
		-- 	break
		-- end
		if utf8.len(de.text) == 1 then
			goto continue
		end
		local ctx = env.engine.context
		local isSimp = ctx:get_option('simplification')
		if isSimp then
			--de.text = t2s:convert(de.text) simplifier會幫轉
		end
		local uph = Phrase(mem, 'fillMenu', 0, 0, de)
		--local ucand = uph:toCandidate() --bug: --此函數所產候選ˇ小狼毫ʸ無㕥以數字鍵或空格鍵擇
		local phCand = uph:toCandidate()
		--local ucand = ShadowCandidate(phCand, phCand.type, phCand.text, phCand.comment) 亦不可上屏
		local ucand = Candidate('fillMenu', seg.start, seg._end, de.text, --[[ de.weight.. ]]'')
		--ucand.quality = phCand.quality 0.0
		ucand.quality = de.weight
		--yield(ucand)
		--local ucand = uph:toCandidate()
		table.insert(additionalCands, ucand)
		::continue::
	end

	table.sort(additionalCands, function (b, a)
		return a.quality > b.quality
	end)

	table.sort(additionalCands, function (b, a)--按字數升序
		return utf8.len(a.text) > utf8.len(b.text)
	end)

	for i,cand in ipairs(additionalCands)do
		yield(cand)
		if i > limit then
			--break
		end
	end
end

---@param env Env
function M.filter.init(env)
	
end

-- function M.filter.func(trans, env, cands) ---@type FilterFn
-- 	TswG.yieldAllTrans(trans)
-- end


---@param trans Translation
---@param env Env
---@param cands Candidate
function M.filter.func_deprecated(trans, env, cands) ---@type FilterFn

	
end


return M