local M = {}
M.processor = {}
function M.processor.init(env)
	
end
function M.processor.func(key, env)---@type ProcessorFn
	local ctx = env.engine.context
	local repr = key:repr()
	--Wat(key:repr())
	if not ctx:has_menu()then
		return 2
	end
	-- if key:repr() == 'Release+Alt_L' then
	-- 	return 1
	-- end
	-- 當先按shift再按退格再松shift、若shift與退格同時按則會觸發中英切換
	if repr == 'Shift+BackSpace' or repr == 'Shift+Release+BackSpace' then
		ctx:clear()
		return 1
	end
	return 2
end
return M