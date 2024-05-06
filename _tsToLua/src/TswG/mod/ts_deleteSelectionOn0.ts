/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/
import * as Module from '@/module'
const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this()
		return o
	}
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		if( ctx.has_menu() ){
			if(key.repr() === '0'){
				const sele = ctx.get_selected_candidate()
				if(sele != void 0){
					ctx.delete_current_selection()
					return pr.kAccepted
				}
			}
		}
		return pr.kNoop
	}
}

export const processor = Processor.new()