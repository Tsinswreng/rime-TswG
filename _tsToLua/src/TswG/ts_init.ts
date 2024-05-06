/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import * as Module from '@/module'

class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this()
		return o
	}
	override init(this: void, env: Env): void {
		
	}
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		return Module.ProcessResult.kNoop
	}
}


export const processor = Processor.new()