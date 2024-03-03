---@generic T
---@class Deque
local Deque = {}
Deque.__index = Deque


function Deque:_new(capacity)
	-- local o = {}
	-- setmetatable(o, self)
	-- self.__index = self
	-- self._data = {}
	-- self._size = 0
	-- self._capacity = capacity
	-- self._frontI = 0+1
	-- self._backI = 0+1
	-- return o
	local o = {}
	setmetatable(o, self)
	o.__index = self
	o._data = {}
	o._size = 0
	o._capacity = capacity
	o._frontI = 0+1
	o._backI = 0+1
	return o
end

--- 创建一个新的双端队列
---@generic T
---@param capacity number 队列的容量
---@return Deque<T>
function Deque.new(capacity)
	--local self = setmetatable({}, Deque)
	local self = Deque:_new(capacity)
	return self
end

--- 获取队列的大小
---@return number
function Deque:size()
	return self._size
end

--- 获取队列的容量
---@return number
function Deque:capacity()
	return self._capacity
end

--- 获取队列的首元素
---@generic T
---@return T
function Deque:front()
	return self._data[self._frontI]
end

--- 获取队列的尾元素
---@generic T
---@return T
function Deque:back()
	return self._data[self._backI]
end

--- 检查队列是否为空
---@return boolean
function Deque:isEmpty()
	return self._size == 0
end

--- 检查队列是否已满
---@return boolean
function Deque:isFull()
	return self._size == self._capacity
end

function Deque:clear()
	self._data = {}
	self._size = 0
	self._frontI = 0+1
	self._backI = 0+1
end

--- 将元素添加到队列尾部
---@generic T
---@param ele T 要添加的元素
---@return boolean 是否成功添加
function Deque:addBack(ele) -- 注意索引始自1
	if self:isFull() then
		return false
	end
	if self:isEmpty() then
		self._data[self._backI] = ele
	else
		self._backI = (self._backI + 1) % (self._capacity+1)
		if self._backI == 0 then
			self._backI = self._backI + 1
		end
		
		self._data[self._backI] = ele
	end
	self._size = self._size + 1
	return true
end

--- 移除队列尾部的元素
---@generic T
---@return T|nil 被移除的元素，如果队列为空则返回nil
function Deque:removeBack()
	if self:isEmpty() then
		return nil
	end
	local t = self:back()
	self._data[self._backI] = nil
	self._size = self._size - 1
	self._backI = self._backI - 1
	if self._backI < 1 then
		self._backI = self._backI + self._capacity
	end
	return t
end

--- 将元素添加到队列头部
---@generic T
---@param ele T 要添加的元素
---@return boolean 是否成功添加
function Deque:addFront(ele)
	if self:isFull() then
		return false
	end
	if self:isEmpty() then
		-- 队列为空时，暂不处理
	else
		self._frontI = self._frontI - 1
		if self._frontI < 1 then
			self._frontI = self._frontI + self._capacity
		end
		self._data[self._frontI] = ele
	end
	self._size = self._size + 1
	return true
end

--- 移除队列头部的元素
---@generic T
---@return T|nil 被移除的元素，如果队列为空则返回nil
function Deque:removeFront()
	if self:isEmpty() then
		return nil
	end
	local t = self:front()
	self._data[self._frontI] = nil
	self._frontI = (self._frontI + 1) % (self._capacity+1)
	if self._frontI == 0 then
		self._frontI = 1
	end
	
	self._size = self._size - 1
	return t
end

--- 扩展队列的容量
---@param neoCapacity number 新的容量
---@return boolean 是否成功扩展
function Deque:expand(neoCapacity)
	if neoCapacity <= self:size() then
		return false
	end
	local neoData = {}
	for i = 1, self:size() do
		neoData[i] = self._data[i]
	end
	self._data = neoData
	self._capacity = neoCapacity
	return true
end

--- 返回队列的前向迭代器
---@generic T
---@return fun():T|nil
function Deque:frontIterFn()
	local i = self._frontI
	--local cnt = 0
	return function()
		-- if cnt >= self:size() then
		-- 	return nil
		-- end
		local t = self._data[i]
		i = (i + 1) % (self._capacity+1)
		if i == 0 then
			i = 1
		end
		--cnt = cnt + 1
		return t
	end
end

--- 返回队列的后向迭代器
---@generic T
---@return fun():T|nil
function Deque:backIterFn()
	local i = self._backI
	--local cnt = 0
	return function()
		-- if cnt >= self:size() then
		-- 	return nil
		-- end
		local t = self._data[i]
		i = i - 1
		if i < 1 then
			i = i + self._capacity
		end
		--cnt = cnt + 1
		return t
	end
end

---@generic T
---@return T[]
function Deque:toArrFromFront()
	local next = self:frontIterFn()
	local ans = {}
	-- local i = -1
	-- while i < self:size() do i = i+1
	-- 	local v = next()
	-- 	table.insert(ans, v)
	-- end
	for i = 1,self:size() do
		local v = next()
		table.insert(ans,v)
	end
	return ans
end

function Deque.copy()
	
end



-----------------


--[[ 
local deque = Deque.new(4)


---@generic T
---@param deque Deque<T>
---@param ele T
local pushF = function (deque, ele)
	if deque:isFull() then
		deque:removeFront()
	end
	deque:addBack(ele)
end

local function printTable(t)
	--print(#t)
	for i,v in ipairs(t)do
		print(v)
	end
	print()
end


pushF(deque, '一')
printTable(deque._data)
pushF(deque, '事')
printTable(deque._data)
pushF(deque, '無')
printTable(deque._data)
pushF(deque, '成')
printTable(deque._data)
print()
printTable(deque:toArrFromFront())
print()
pushF(deque, '二')
printTable(deque:toArrFromFront())
deque:clear()
pushF(deque, '一')
printTable(deque._data)
pushF(deque, '事')
printTable(deque._data)
pushF(deque, '無')
printTable(deque._data)
pushF(deque, '成')
printTable(deque._data)
print()
printTable(deque:toArrFromFront())
print()
pushF(deque, '二')
printTable(deque:toArrFromFront()) ]]

-----------------





return Deque


