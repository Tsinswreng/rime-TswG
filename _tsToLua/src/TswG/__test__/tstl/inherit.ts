
export{}
function setPrototypeOf<T>(this:void, o:T, proto){
	// const mt = {}
	// mt.__index = proto
	//return setmetatable(o, mt)
	setmetatable(o,{__index:proto})
	return o
}

class Parent{

	constructor(name:string, age:number){
		this._name = name
		this._age = age
	}

	protected _name:string
	get name(){return this._name}

	protected _age:number
	get age(){return this._age}
}

class Child extends Parent{

	constructor(name:string, age:number, gender:string){
		super(name, age)
		this._gender = gender
	}

	
	protected _gender:string
	get gender(){return this._gender}

}


function test(){
	const pa = new Parent('name', 13)
	const ch = new Child('n', 12, 'male')

	console.log(ch instanceof Parent)
	console.log(ch instanceof Child)
	console.log(ch.age)
	console.log(ch['_age'])
	console.log(ch.gender)
	console.log(ch['_gender'])
}

test()