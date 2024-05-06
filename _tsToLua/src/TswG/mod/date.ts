/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/
import * as Module from '@/module'
import { getMilliseconds as mills } from '@/ts_Ut'
import * as Str from '@/strUt'

//let getMilliseconds = ()=>void 0
let getMilliseconds = mills


// for(let i = 0; i < 99999; i++){
// 	let m = getMilliseconds()
// 	Wat(m)
// }

class Opt{
	tag = 'date'
}

class Mod extends Module.ModuleStuff{
	static new(){
		const o = new this()
		return o
	}
	get name(): string {
		return 'date'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt:Opt = new Opt()
	get opt():Opt{
		return this._opt
	}
	protected _env: Env
	millis3(){
		const mills = getMilliseconds()
		if(mills == void 0){
			return mills
		}
		const millsStr = mills+''
		return Str.utf8sub(millsStr, millsStr.length-3, millsStr.length-1)
	}

}

export const mod = Mod.new()

class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}
	

	func(this: void, input: string, segment: Segment, env: Env): void {
		const cand = Candidate(mod.opt.tag, segment.start, segment._end, '','')
		cand.quality = 9999
		switch(input){
			case '\\\\':
				const millis3 = mod.millis3()
				if(millis3 == void 0){
					cand.text = os.date("%Y-%m-%dT%H:%M:%S.000+08:00")
				}else{
					cand.text = os.date("%Y-%m-%dT%H:%M:%S.")
					cand.text += millis3+'+08:00'
				}
			break;
			case '//':
				cand.text = os.date("%Y%m%d%H%M%S")
			break;
			case '///':
				cand.text = os.date("%y.%m.%d")
			break;
			default:
			return
		}
		if(cand.text !== ''){
			yield_(cand)
		}

	}
}

export const translator = Translator.new()