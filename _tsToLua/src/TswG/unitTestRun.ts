/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import * as Module from '@/module'
import { describe,it,expect } from '@/UnitTest'
//import run from '@/__test__/__ts_lib__/EventEmitter'
import { unitTest } from './__test__/UnitTest'
//import {run} from '@/__test__/ts_algo'
//import {run} from '@/__test__/ts_Ut'
//import {run} from '@/__test__/strUt'
//import {run} from '@/__test__/tstl/tstl'
import {run} from '@/__test__/History'
import { SchemaOpt } from './SchemaOpt'


class Processor extends Module.RimeProcessor{
	override init(){
		//run()
	}
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		const config = env.engine.schema.config
		// const path = 'TswG/ts_predict/charToPush'
		// const opt = env.engine.schema.config.get_string(path)
		// Wat(opt)
		
		
		//const path = root+sep+inst.opts.ts_predict.name
		//const opt = config.get_item(path)
		//const ret = SchemaOpt.parsePathRecursive(config, path, (cv)=>cv)
		// Wat('ret: ')
		// Wat(ret)
		//Wat(opt.type)

		// const tr = (path:string)=>{
		// 	const item = config.get_item(path)
		// 	if(item != void 0){
		// 		const v = item.get_value()
		// 		v.get_bool()
		// 	}
			
		// }
		
		
		//Wat(opt)
		//@ts-ignore
		//Wat(opt?.keys())
		//Wat(opt.)
		return Module.ProcessResult.kNoop
	}
}



const processor = new Processor()
export {processor}

