local M = {}
M.processor = {}

local rimeUt = require('rimeUtil')

local dictName = 'dks'


local mem ---@type Memory
--local rdb = ReverseDb()
local t2s = Opencc('t2s.json')

---@param mem Memory
---@param input string 碼
---@param text string 字
---@param convertFn fun(str:string):string
local function deleteUserDict(mem, input, text, convertFn)
	if not convertFn then
		convertFn = function (str)
			return str
		end
	end
	-- local de = DictEntry()
	-- de.text

	
	-- mem:user_lookup('scj sas', true) --input
	-- for de in mem:iter_user()do
	-- 	local detext = de.text
	-- 	detext = convertFn(detext)
	-- 	Wat({detext, de.custom_code,text, input})

	-- 	if detext == text then
	-- 		--mem:update_userdict(de, -1, '')
	-- 		--Wat('abolish: '..de.text)
	-- 		log.info('abolish: '..de.text)
	-- 		--error('success')
	-- 	end
	-- end
end




---@param env Env
function M.processor.init(env)
	mem = Memory(env.engine, env.engine.schema)
	
end

function M.processor.func(key, env)---@type ProcessorFn
	local ctx = env.engine.context
	local isSimp = ctx:get_option('simplification')
	local convertFn = function (str)
		return str
	end
	if isSimp then
		convertFn = function (str)---@param str string
			return t2s:convert(str)
		end
	end
	if ctx:has_menu()then
		if key:repr() == '0' then
			if ctx:has_menu() then
				
				local sele = ctx:get_selected_candidate()
				if sele then
					ctx:delete_current_selection() --一次刪多個
					return 1
				end
				--deleteUserDict(mem, ctx.input, sele.text, convertFn)
			end
		--if key.keycode == 48 then 叵、爾則連刪兩個、鈣按下與擡起旹各祘一次。

		end
	end
	return 2
end

return M


