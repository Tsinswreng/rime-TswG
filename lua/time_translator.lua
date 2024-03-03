
local function time_translator(input, seg) ---@type TranslatorFn
	if (input == "//") then
		--Wat(seg.start) -- 0
		--Wat(seg._end) -- 2
		local cand = Candidate("date", seg.start, seg._end, os.date("%y.%m.%d"), "")
		cand.quality = 9999
		--print( string.char(07))
		yield(cand)
	end
	if (input == "/'") then
	   local cand = Candidate("time", seg.start, seg._end, os.date("%H%M"), "")  
	   cand.quality = 999
	   yield(cand)
	end
	if (input == "///") then
		local cand = Candidate("time", seg.start, seg._end, os.date("%y.%m.%d-%H%M"), "") 
		cand.quality = 999
		yield(cand)
	end
	if (input == "////") then
		local cand = Candidate("time", seg.start, seg._end, os.date("%Y%m%d%H%M%S"), "")  -- 不能寫YYYYMMDDHHmmss
		cand.quality = 999
		yield(cand)
	end
	if (input == "??") then
		local cand = Candidate("time", seg.start, seg._end, os.date("%Y-%m-%dT%H:%M:%S+08:00"), "")  -- 不能寫YYYYMMDDHHmmss
		cand.quality = 999
		yield(cand)
	end
	if (input == "???") then 
		-- local mill = os.clock()*1000 -- ..mill.."+08:00"
		local cand = Candidate("time", seg.start, seg._end, os.date("%Y-%m-%dT%H:%M:%S.000+08:00"), "")  -- 不能寫YYYYMMDDHHmmss
		cand.quality = 999
		yield(cand)
	end
	
	if (input == "/\\") then
	local cand = Candidate("time", seg.start, seg._end, os.date("%Y_%m_%d_%H%M%S"), "")
	cand.quality = 999
	yield(cand)
	
	end
	
 end 
return time_translator