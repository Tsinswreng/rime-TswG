/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */


// namespace global{

// }

Error.prototype.toString = function(this:Error){
	let ans = 
	'name: '+this.name
	+'\n'+'message: '+this.message
	+'\n'+'stack: '+this.stack
	return ans
}


class Console{
	protected constructor(){

	}
	static new(){
		const o = new this()
		return o
	}
	log(v){
		Wat(v)
	}
	info(v:string){
		_ENV.log.info(v)
	}
	warn(v:string){
		_ENV.log.warning(v)
	}
	error(v:string){
		_ENV.log.error(v)
	}
}
declare var console:Console
console = Console.new()