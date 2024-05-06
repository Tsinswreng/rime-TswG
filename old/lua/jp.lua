--[[ 
Copyright (c) 2024 TsinswrengGwāng<tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG
 ]]

local M = {}
M.translator = {}
M.filter = {}
local rimeUt = require('rimeUtil')
local config = require('config').default
local t2jp = Opencc('t2jp.json')
--local switchName = 'japanese_kanji'
local switchName = config.jp.switchName
local hiraganaSchemaName = 'hiragana'
local hiraganaMem---@type Memory

local commitConnection---@type Connection
local selectConnection---@type Connection
local limit = 16



function M.translator.init(env)
	local hiraganaSchema = Schema(hiraganaSchemaName)
	hiraganaMem = Memory(env.engine, hiraganaSchema)
	
end

function M.translator.func(input, seg, env) ---@type TranslatorFn
	local ctx = env.engine.context
	local isOn = ctx:get_option(switchName)
	if isOn then
		--以此法則甚卡且假名未居于前
		-- hiraganaMem:dict_lookup(input, true, 4)
		
		-- for de in hiraganaMem:iter_dict()do
		-- 	local ph = Phrase(hiraganaMem, '', seg.start, seg._end, de)
		-- 	local cand = ph:toCandidate()
		-- 	cand.quality = 999999999999999999999999999999999999999999999999999999999999999999999999999999999
		-- 	yield(cand)
		-- 	Wat(cand.text)
		-- end
	end
end

---@param env Env
function M.filter.init(env)
	---@param ctx Context
	local function commitCallback(ctx)
		local commit = ctx:get_commit_text()
		commit = t2jp:convert(commit)
		--Wat(env)
		-- env.engine.context:clear()
		-- env.engine:commit_text('1')
	end
	---@param ctx Context
	local function selectCallback(ctx)
		local commit = ctx:get_commit_text()
		commit = t2jp:convert(commit)

	end
	commitConnection,selectConnection = rimeUt.initCommitEtSelectNotifier(env, commitCallback, selectCallback)

end

function M.filter.func(trans, env)---@type FilterFn
	local ctx = env.engine.context
	local isOn = ctx:get_option(switchName)
	--Wat(isOn)
	local cands = {} ---@type Candidate[]
	if not isOn then
		--TswG.yieldAllTrans(trans)
		rimeUt.yieldAllTrans(trans)
		return
	end
	local i = 1
	for cand in trans:iter()do
		if i > limit then
			break
		end
		local textOri = cand.text
		local neoText = t2jp:convert(textOri)
		--cand.text = neoText --非自以lua產者不可改
		if neoText ~= textOri then
			local shadow = ShadowCandidate(cand, cand.type, neoText, cand.comment)
			table.insert(cands, shadow)
		else 
			table.insert(cands, cand)
		end
		i = i + 1
	end 
	for i,v in ipairs(cands)do
		yield(v)
	end
end

return M

-- local neoCand = Candidate(
-- 				cand.type
-- 				,cand.start
-- 				,cand._end
-- 				,neoText
-- 				,cand.comment
-- 			)
-- 			neoCand.quality = cand.quality
-- 			neoCand.text = '123'