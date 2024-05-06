local M = {}
M.osType = nil
function M.init()
	M.osType = os.getenv('OS')
end
return M