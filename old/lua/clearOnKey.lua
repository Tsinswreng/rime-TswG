--[[ 
Copyright (c) 2024 TsinswrengGwāng <tsinswreng@gmail.com>
This code is licensed under MIT License.
https://github.com/Tsinswreng/rime-TswG

有菜單旹 按下左或右shift 又直接松開 則 清空菜單

 ]]

local HistoryDeque = require('HistoryDeque')
local ut = require('ut')
local algo = require('algo')
local M = {}
M.processor = {}


function M.processor.init(env)
	
end
-- Shift+Shift_L Release+Shift_L
--KeySequence()

local reprDeque = HistoryDeque.new(4)


---@param str string
local function rmTail(str)
	return string.sub(str, 1, #str-1)
end

function M.processor.func(key, env)---@type ProcessorFn

	local ctx = env.engine.context
	local repr = key:repr()
	--Wat(key:repr())
	
	reprDeque:addBackF(repr)
	local reprArr = reprDeque:toArrFromFront()
	algo.reverseLocal(reprArr)

	if not ctx:has_menu()then
		return 2
	end
	-- if key:repr() == 'Release+Alt_L' then
	-- 	return 1
	-- end

	-- 當先按shift再按退格再松shift、若shift與退格同時按則會觸發中英切換
	-- if repr == 'Shift+BackSpace' or repr == 'Shift+Release+BackSpace' then
	-- 	ctx:clear()
	-- 	return 1
	-- end

	local k1 = repr
	local k2 = reprArr[2]
	k1 = rmTail(k1)
	k2 = rmTail(k2)
	local b = ( k1 == 'Shift+Shift_' and k2 == 'Release+Shift_' )
		or ( k2 == 'Shift+Shift_' and k1 == 'Release+Shift_' )
	
	if b then
		ctx:clear()
		return 1
	end

	return 2
end
return M