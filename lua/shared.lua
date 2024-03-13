local ut = require('ut')
local config_ = require('config')
local HistoryDeque = require("HistoryDeque")
local M = {}

M.config = config_.default
M.hasLoaded = false

---@param schemaId string
function M.loadConfig(schemaId)
	if M.hasLoaded then
		return M.config
	end
	if schemaId == nil then
		return config_.default
	end
	
	local custom = config_[schemaId]
	if custom ~= nil then
		local merged = ut.toDeepMerge(config_.default, custom)
		M.config = merged
		M.hasLoaded = true
	end
	
	
	return M.config
end

M.userWordCombiner = {
	commit__inputHisDeq = HistoryDeque.new(4) ---@type HistoryDeque<string[]>  --- in ts: HistoryDeque<[string, string]>
	,fullPunctSet = {} ---@type table<string, string>
}


---@param schemaId string
function M.userWordCombiner.init_fullPunctSet(schemaId)
	local config = M.loadConfig(schemaId) ---@type LuaConfig
	if #M.userWordCombiner.fullPunctSet == 0 then
		for i,v in ipairs(config.userWordCombiner.fullPunctArr)do
			M.userWordCombiner.fullPunctSet[v] = v
		end
	end
end

---@param commitText string
function M.userWordCombiner.isTimeToClearDeq(commitText)
	local fullPunctSet = M.userWordCombiner.fullPunctSet
	---@param c string
	local function l(c)

		local charCode = string.byte(c)
		if #c == 1 and charCode <= 127 then
			return true
		elseif fullPunctSet[c] then
			return true
		end
		return false
	end
	
	for i=1,utf8.len(commitText)do
		local char = ut.utf8_sub(commitText, i, i)
		assert(char)
		local ans = l(char)
		if ans then
			return ans
		end
	end
	return false
end

M.predict = {
	
}


return M