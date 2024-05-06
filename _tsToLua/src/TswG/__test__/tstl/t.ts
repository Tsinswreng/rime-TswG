class C{
	constructor(inst){
		this._inst = inst
	}
	_inst = 'inst'
	get inst(){return this._inst}
	set inst(v){this._inst = v}

	instFn(){
		return 'instFn'
	}

	static stat = 'stat'
	static name = 'name'
	static statFn(){
		return 'statFn'
	}
}

class D extends C{
	protected constructor(inst){
		super(inst)
	}
}

const inst = new C('inst')
inst._inst
inst.inst

function setPrototypeOf(target, base){
	//target.____super = base
	let staticMetatable = setmetatable({__index:base}, base)
	setmetatable(target, staticMetatable)
	let baseMetatable = getmetatable(base)
	if( baseMetatable ){
		if( type(baseMetatable.__index) === 'function' ){
			staticMetatable.__index = baseMetatable.__index
		}
		if( type(baseMetatable.__newindex) === 'function' ){
			staticMetatable.__newindex = baseMetatable.__newindex
		}
	}
	//setmetatable(target.prototype, base.prototype)
    // if type(base.prototype.__index) == "function" then
    //     target.prototype.__index = base.prototype.__index
    // end
    // if type(base.prototype.__newindex) == "function" then
    //     target.prototype.__newindex = base.prototype.__newindex
    // end
    // if type(base.prototype.__tostring) == "function" then
    //     target.prototype.__tostring = base.prototype.__tostring
    // end

}


export {}
