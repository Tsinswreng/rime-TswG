local ArrayDeque = require("ArrayDeque")
local HistoryDeque = ArrayDeque:_new(0)
HistoryDeque.__index = HistoryDeque



---@generic T
---@class HistoryDeque : Deque
---@field c_cb_cba string[]
---@field addFrontF fun(self:HistoryDeque, ele:T)
---@field addBackF fun(self:HistoryDeque, ele:T)


---@param capacity integer
---@return HistoryDeque
function HistoryDeque:_new(capacity)
	local o = ArrayDeque:_new(capacity)
	setmetatable(o, self)
	self.__index = self
	self.c_cb_cba = {}
	return o
end


---@param capacity integer
---@return HistoryDeque
function HistoryDeque.new(capacity)
	local o = HistoryDeque:_new(capacity)
	--setmetatable(o, HistoryDeque)
	return o
end


---@generic T
---@param self HistoryDeque
---@param ele T
function HistoryDeque:addBackF(ele)
	if self:isFull()then
		self:removeFront()
	end
	self:addBack(ele)
end

---@generic T
---@param self HistoryDeque
---@param ele T
function HistoryDeque.addFrontF(self, ele)
	if self:isFull()then
		self:removeBack()
	end
	self:addFront(ele)
end


---@param deque Deque<string>
---@return string[]
function HistoryDeque.abc_to_c_cb_cba(deque)
	local next = deque:backIterFn()
	local ans = {}---@type string[]
	local i = 1
	
	while i-1< deque:size() do
		local v = next()
		if i == 1 then
			table.insert(ans, v)
		else
			local e = ans[i-1]
			--e = e..v
			e = v..e
			table.insert(ans, e)
		end
		i=i+1
	end
	return ans
end


return HistoryDeque