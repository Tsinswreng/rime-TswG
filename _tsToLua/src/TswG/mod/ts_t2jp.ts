/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */
import * as Module from '@/module'


class Opt{
	static new(){
		const o = new this()
		return o
	}

	limit = 16
	switchName = 'japanese_kanji'
}

export const opt = Opt.new()

class Mod{
	static new(opt:Opt){
		const o = new this()
		o.__init__(opt)
		return o
	}
	protected __init__(opt:Opt){
		this.opt = opt
	}

	opt = opt
	t2jp = Opencc('t2jp.json')
	isOn(ctx:Context){
		return ctx.get_option(opt.switchName)
	}
}

export const mod = Mod.new(opt)

class Filter extends Module.RimeFilter{
	static new(){
		const o = new this()
		return o
	}

	override init(this: void, env: Env): void {
		
	}

	override func(this: void, translation: Translation, env:Env): void {
		const ctx = env.engine.context
		if(!mod.isOn(ctx)){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}
		const cands = [] as Candidate[];
		{
			let i = 0
			for(const cand of translation.iter()){
				const oriText = cand.text
				const neoText = mod.t2jp.convert(oriText)
				if( oriText !== neoText ){
					const shadow = ShadowCandidate(cand, cand.type, neoText, cand.comment)
					cands.push(shadow)
				}else{
					cands.push(cand)
				}
				i++
				if(opt.limit >=0 && i>= opt.limit){
					break
				}
			}
		}
		for(const cand of cands){
			yield_(cand)
		}
	}

	override fini(this: void, ...args: any[]): void {
		
	}
}

export const filter = Filter.new()
