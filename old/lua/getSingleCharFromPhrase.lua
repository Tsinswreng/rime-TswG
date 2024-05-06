local M = {}
M.processor = {}
local ut = require('ut')
local utf8_sub = ut.utf8_sub

local function firstChar(s)
	return utf8_sub(s, 1, 1)
end

local function lastChar(s)
	return utf8_sub(s, -1, -1)
end

function M.processor.init(env)
	
end

function M.processor.func(key, env)---@type ProcessorFn

	return 2
end


local function getSingleCharFromPhrase(key, env)---@type ProcessorFn
	local engine = env.engine --取引擎對象
	local context = engine.context --取context對象
	local commit_text = context:get_commit_text() --取 文本芝已確認
	local config = engine.schema.config 
	local first_key = config:get_string('key_binder/select_first_character') or 'bracketleft' --如果用户没有配置该按键，则 config:get_string() 方法返回空字符串，因此我们使用 Lua 中的 or 运算符将默认值 bracketleft 与返回的字符串进行逻辑或运算。如果用户没有配置选择第一个字符的按键，则 first_key 变量将被赋值为默认值 bracketleft，否则它将被赋值为用户配置的按键。
	local last_key = config:get_string('key_binder/select_last_character') or 'bracketright'

	

	if (key:repr() == first_key and commit_text ~= "" and string.len(commit_text) >= 2) then --key:repr()取当前按键的名称 commit_text 则是输入法引擎当前正在输入的文本
		
		engine:commit_text(firstChar(commit_text))
		context:clear()
		return 1
	end

	if (key:repr() == last_key and commit_text ~= "" and string.len(commit_text) >= 2) then
		engine:commit_text(lastChar(commit_text))
		context:clear()
		return 1
	end
	return 2
end
return getSingleCharFromPhrase
