




// class Opts{
// 	static new(){
// 		const o = new this()
// 		return o
// 	}
// }



// export class deprecated{
// 	static readonly root='TswG'
// 	protected constructor(){}
// 	protected static new(env:Env){
// 		const o = new this()
// 		o.__init__(env)
// 		return o
// 	}
// 	protected static _inst:deprecated
	
// 	static getInstance(env?:Env){
// 		if(deprecated._inst != void 0){
// 			return deprecated._inst
// 		}
// 		if(env == void 0){
// 			throw new Error('init error, args is nil')
// 		}
// 		deprecated._inst = deprecated.new(env)
// 		return deprecated._inst
// 	}

// 	protected __init__(env:Env){
// 		const z = this
// 		const yamlOpt =  env.engine.schema.config.get_map(deprecated.root)
// 		Wat(yamlOpt) //t
// 	}
// 	readonly This=deprecated

// 	protected _opts:Opts = Opts.new()
// 	get opts(){return this._opts}
// }




