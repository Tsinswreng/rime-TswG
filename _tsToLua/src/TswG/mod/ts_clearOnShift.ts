/**
 * 
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 * 有菜單旹 按下左或右shift 又直接松開 則 清空菜單
 * 
 * 
 */

import { History } from "../History";
import * as Module from '@/module'



class Mod{
	static new(){
		const o = new this()
		o.__init__()
		return o
	}
	protected __init__(){

	}
	keyReprHistory = History.new<string>(4)
	rmTail(this:void, str:string){
		return string.sub(str, 1, Lua.len(str)-1)
	}
}

export const mod = Mod.new()

const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this
		return o
	}
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		const repr = key.repr()
		mod.keyReprHistory.addBackF(repr)

		if( !ctx.has_menu() ){
			return pr.kNoop
		}
		
		let curKey = repr
		let lastKey = mod.keyReprHistory.backGet(1)

		curKey = mod.rmTail(curKey)
		lastKey = mod.rmTail(lastKey)
		const b = 
		(curKey === 'Release+Shift_') && (lastKey == 'Shift+Shift_')
		// Wat(curKey)
		// log.error(lastKey)
		if(b){
			ctx.clear()
			return pr.kAccepted
		}

		return pr.kNoop
	}
}

export const processor = Processor.new()