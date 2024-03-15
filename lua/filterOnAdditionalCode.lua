--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local M = {}
M.filter = {}

local ut = require('ut')
local shared = require('shared')
local commit__inputHisDeq = shared.userWordCombiner.commit__inputHisDeq
local pattern = '^[a-z,\\.;]{3}[A-Z<>][a-z,\\.]?$'
local reverseName = 'dks_v'
local reverseDb = ReverseLookup(reverseName) ---@type ReverseDb

local lower = 'abcdefghijklmnopqrstuvwxyz,.'
local upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<>'

local lower__upper = {}
local upper__lower = {}

local uniqueMarkInComment = ''
local non_uniqueMark = '⬤'

local function init_lowerEtUpperMaps()
	local lowerArr = ut.splitString(lower, '')
	local upperArr = ut.splitString(upper, '')
	for i,v in ipairs(lowerArr)do
		local l = lowerArr[i]
		local u = upperArr[i]
		lower__upper[l] = u
		upper__lower[u] = l
	end
end
init_lowerEtUpperMaps()

---@param str string
---@param pos integer
local function asciiToLowerAt(str, pos)
	local sub = string.sub
	local before = sub(str, 1, pos-1)
	local atPos = sub(str, pos, pos)
	local after = sub(str, pos+1, #str)
	-- Wat('b: '..before)
	-- Wat('atP: '..atPos)
	-- Wat('after: '..after)
	
	if upper__lower[atPos] then
		atPos = upper__lower[atPos]
		--Wat('alt: '..atPos)
	end
	return before..atPos..after
end

--Wat(asciiToLowerAt('kyhKa', 4))


---@param prefix string
---@param str string
---@return boolean
local function isAPrefixOfB(prefix, str)
	return string.match(str, "^" .. prefix) ~= nil
end



---@param db ReverseDb
---@param str string
---@return table<string, string>
local function rvLookup_set(db, str)
	local lk = db:lookup(str)
	local lkArr = ut.splitString(lk, ' ')
	local ans = {}
	for i,v in ipairs(lkArr)do
		ans[v] = str
	end
	return ans
end


local match = rime_api.regex_match



---@param env Env
function M.filter.init(env)
	
end

function M.filter.func(trans, env) ---@type FilterFn
	local ctx = env.engine.context
	local cands = {} ---@type Candidate[]
	local i = 1
	local isUsingAddtionalCode = false
	for cand in trans:iter()do
		local text = cand.text
		local preedit = cand.preedit
		if i == 1 then
			if match(preedit, pattern)then
				isUsingAddtionalCode = true
			end
		end
		if i > 1 and isUsingAddtionalCode then
			if not match(preedit, pattern)  then
				break
			end
		end
		table.insert(cands, cand)
		i = i + 1
	end
	if isUsingAddtionalCode then
		for i, cand in ipairs(cands)do
			if #cands > 1 then
				cand.comment = non_uniqueMark..cand.comment
			end
			yield(cand)
		end
	else
		for i,cand in ipairs(cands)do
			yield(cand)
		end
	end
	
end


function M.filter.func_deprecated(trans, env) ---@type FilterFn
	local ctx = env.engine.context
	local composition = env.engine.context.composition
	local cands = {} ---@type Candidate[]
	local i = 0
	local toCommit = ''
	local thePreedit = ''
	local hasMatched = false
	local timeToCommit = false
	for cand in trans:iter()do
		local text = cand.text
		local preedit = cand.preedit
		-- if preedit == 'dsq' or preedit == 'dsqA'  then
		-- 	Wat({i, text, preedit})
		-- end
		if i == 0 then
			if match(preedit, pattern)then
				toCommit = text
				thePreedit = preedit
				hasMatched = true
			end
		end

		if i >=1 and hasMatched and not match(preedit, pattern)then
			timeToCommit = true
			break
		end
		table.insert(cands, cand)
		--yield(cand)

		-- if match(ctx.input, pattern) then
		-- 	local l_input = asciiToLowerAt(ctx.input, 4)
		-- 	local rvl = reverseDb:lookup(text)
		-- 	local rvlArr = ut.splitString(rvl, ' ')
		-- 	for i,v in ipairs(rvlArr)do
		-- 		if isAPrefixOfB(l_input, v) then
		-- 			toCommit = text
		-- 			Wat('preedit: '..cand.preedit)
		-- 			Wat(toCommit)
		-- 		end
		-- 	end
		-- 	--local rvlSet = rvLookup_set(reverseDb, text)
		-- 	-- env.engine:commit_text(text)
		-- 	-- ctx:clear()
		-- end
		i = i + 1
	end

	if #cands == 1 then
		local cand = cands[1]
		cand.comment = cand.comment .. uniqueMarkInComment
		--Wat({cand.text, cand.comment})
		yield(cand)
	else
		for i,cand in ipairs(cands)do

			cand.comment = cand.comment .. non_uniqueMark
			yield(cand)
		end
	end

	if timeToCommit == true or (#cands == 1 and hasMatched) then
		--敗ᵗ例: 知 twaO
		---用ctx:select() 等㕥提交皆有謬
		--ctx:clear()
		--env.engine:commit_text(toCommit)
		--commit__inputHisDeq:addBackF({toCommit, thePreedit})
		--ctx:clear()
		
		return
	end
	--TswG.yieldAllTrans(trans)
end

return M
