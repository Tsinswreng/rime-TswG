log.warning(" > rime.lua")
--local ut =  require('ut')
--Wat = ut.logWarnJson
Wat=function(a,b,c,d,e,f,g)end


do
	local function ____catch(____error)
		log.error(____error.name)
		log.error(____error.message)
		log.error(____error.stack)
		log.error(debug.traceback())
	end
	local ____try, ____hasReturned = pcall(function()
		require('TswG')
	end)
	if not ____try then
		____catch(____hasReturned)
	end
end


