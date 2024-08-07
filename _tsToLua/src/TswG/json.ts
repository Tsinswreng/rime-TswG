import * as ison from '@/_lua_lib/ison'
class Js_Json{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Js_Json.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return JSON}
	parse(json:str){
		return ison.decode(json)
	}

	stringfy(o){
		return ison.encode(o)
	}
}

/** js風格 */
export const JSON = Js_Json.new()

class Json{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Json.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return Json}
	
	toJson(...args: Parameters<typeof ison.encode>){
		return ison.encode(...args)
	}

	deJson(...args: Parameters<typeof ison.decode>){
		return ison.decode(...args)
	}

	
}


