local M = {}
local env_ = require('env_')
M.outPath = rime_api.get_user_data_dir() .. '/' .. 'clipboard.txt'

---每次調用旹都會閃過cmd、較慢
---@return string|nil
local function readClipboard_win()
	local ok, ans = pcall(function ()
		local cmd = "powershell.exe -Command Get-Clipboard"
		
		local handle = io.popen(cmd)
		
		local result = handle:read("*a")
		
		handle:close()
		return result
	end)
	if ok then
		return ans
	else
		log.error(ans)
	end
end

local function readClipboard_win2()
	local ok, ans = pcall(function ()
		local cmd = "echo | set /p=" -- 'echo' a new line, 'set /p' prints without newline, '=' to avoid a trailing newline
		local handle = io.popen(cmd)
		handle:close()
		
		cmd = "powershell.exe -Command Get-Clipboard"
		handle = io.popen(cmd)
		local result = handle:read("*a")
		handle:close()
		
		return result
	end)
	if ok then
		return ans
	else
		log.error(ans)
	end
end

local function nodeReadClipboard_deprecated()
	local path = (rime_api.get_user_data_dir())..'/'..'_js\\printClipboard.mjs'
	local ok, ans = pcall(function ()
		--local cmd = 'node '..path 
		local cmd = 'echo "114514"'
		
		local handle = io.popen(cmd)
		
		--local result = handle:read("*a")
		local result = ''
		local line = handle:read('l')
		
		while line do
			result = result .. line .. '\n'
		end
		result = string.sub(result, 1, #result-1) --除ᵣ末ᵗ\n
		
		handle:close()
		
		
		return result
	end)
	if ok then
		return ans
	else
		log.error(ans)
	end
end


---@param exput string|nil
---@param cd string|nil deprecated
local function nodeSaveClipboard(exput, cd)
	local path = (rime_api.get_user_data_dir())..'/'..'_js\\printClipboard.mjs'
	local ok, ans = pcall(function ()
		local cmd = 'node '.. '"'..path..'"'
		if exput then
			cmd = cmd.. ' > '..'"'..exput..'"'
		end
		if cd then
			local cdCmd = 'cd ' .. '"' ..cd..'"'
			--Wat(cdCmd)
			os.execute()
		end
		--Wat(cmd)
		os.execute(cmd)
	end)
	if ok then
		return ans
	else
		log.error(ans)
	end
end

---@param exput string|nil
---@param cd string|nil deprecated
local function powershellSaveClipboard(exput, cd)
	--local path = (rime_api.get_user_data_dir())..'/'..'_js\\printClipboard.mjs'
	local ok, ans = pcall(function ()
		--local cmd = 'node '.. '"'..path..'"'
		local cmd = 'powershell.exe -command "Get-Clipboard"'
		if exput then
			cmd = cmd.. ' > '..'"'..exput..'"'
		end
		if cd then
			local cdCmd = 'cd ' .. '"' ..cd..'"'
			--Wat(cdCmd)
			os.execute()
		end
		--Wat(cmd)
		os.execute(cmd)
	end)
	if ok then
		return ans
	else
		log.error(ans)
	end
end


---@param path string|nil
---@return string|nil
local function readClipboardFile(path)
	if not path then
		path = M.outPath
	end
	local file = io.open(path, "r")
	if not file then
		log.error(path..'\ncannot read')
		return
	end
	local ans = file:read("*a")
	file:close()
	return tostring(ans)
end


--Windows_NT

---@param exput string|nil
---@param cd string|nil
---@return string|nil
function M.getClipboard_deprecated(exput, cd)
	local osName = env_.osType
	if osName == 'Windows_NT' then
		return nodeSaveClipboard(exput, cd)
	end
end

function M.saveEtRead()
	nodeSaveClipboard(M.outPath)
	--powershellSaveClipboard(M.outPath) --容易卡死
	local ans = readClipboardFile()
	if not ans then
		return ''
	end
	local last = string.sub(ans, #ans-1, #ans)
	-- if last == '\n' then
		
	-- end
	ans = string.sub(ans, 1, #ans-1) --除ᵣ末ᵗ換行
	return ans
end

function M.save()
	nodeSaveClipboard(M.outPath)
end

function M.read()
	local ans = readClipboardFile()
	if not ans then
		return ''
	end
	local last = string.sub(ans, #ans-1, #ans)
	-- if last == '\n' then
		
	-- end
	ans = string.sub(ans, 1, #ans-1) --除ᵣ末ᵗ換行
	return ans
end

---@deprecated
function M.getClipboard_fn()
	local cmd = "powershell.exe -Command Get-Clipboard"
	local handle = io.popen(cmd)
	local result = handle:read("*a")
	handle:close()
	local cb = result
	return cb
end

return M