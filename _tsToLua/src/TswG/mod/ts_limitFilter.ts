/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import * as Module from '@/module'
import * as Ut from '@/ts_Ut'

class Opt{
	static new(){
		const o = new this()
		return o
	}
	limit=128
	min = 0
	candidateToFill = Candidate('',0,0,' ','')
}

const opt = Opt.new()
class Filter extends Module.RimeFilter{
	static new(){
		const o = new this()
		return o
	}
	
	func(this:void, translation: Translation): void {
		
		let cnt = 0
		for(const cand of translation.iter()){
			yield_(cand)
			cnt++
			if(cnt >= opt.limit){
				break
			}
		}
		const min = opt.min
		if(cnt < min){
			for(let i = 0; i < min-cnt; i++){
				yield_(opt.candidateToFill)
			}
		}
	}

}

const filter = Filter.new()
export {filter}
