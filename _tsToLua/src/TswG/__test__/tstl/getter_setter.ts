
export{}

/* 
local function setPrototype(t, p)
  setmetatable(t, p)
  p.__index = p
end
*/
function setPrototypeOf<T>(this:void, o:T, proto){
	// const mt = {}
	// mt.__index = proto
	//return setmetatable(o, mt)
	//setmetatable(o,{__index:proto})
	setmetatable(o, proto)
	proto.__index = proto
	return o
}

interface IF{
	__init__(...args:any[]):this
}

class Parent implements IF{

	protected constructor(){}

	static new(name:string, age:number):Parent
	static new(...p:any[]):never

	static new(name:string, age:number){
		const o = new this()
		// o._name = name
		// o._age = age
		o.__init__(name, age)
		return o
	}


	__init__(...param:Parameters<typeof Parent.new>): this {
		const z = this
		z._name = param[0]
		z._age = param[1]
		return z
	}

	protected _name:string
	get name(){return this._name}

	protected _age:number
	get age(){return this._age}
}

class Child extends Parent{

	protected constructor(){
		super()
	}

	
	static new(name:string, age:number, gender:string):Child
	static new(...p:any[]):never
	static new(name:string, age:number, gender:string):Child{
		// const p = Parent.new(name, age)
		// const c = new this()
		// c._gender = gender
		// setPrototypeOf(p,c)
		// return p as Child
		let o = new this()
		o = o.__init__()
		return o
	}

	override __init__(...param: Parameters<typeof Parent.new>): this {
		const z = this
		super.__init__(param[0], param[1])
		z._gender = param[2]
		return z
	}

	protected _gender:string
	get gender(){return this._gender}

}


function test(){
	const pa = Parent.new('name', 13)
	const ch = Child.new('n', 12, 'male')

	console.log(ch instanceof Parent)
	console.log(ch instanceof Child)
	console.log(ch.age)
	console.log(ch['_age'])
	console.log(ch.gender)
	console.log(ch['_gender'])
}

test()