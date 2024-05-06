/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/


/* 
dependencies: [
	module.ts,
	strUt.ts,
	SchemaOpt.ts
]

schema.yaml中
TswG: {
	phraseReverse: {
		effectTag: 'terra_pinyin' # 有此tag旹 生效
		,reverseDbName: 'cangjie5' # 生效旹 comment中逐字顯示的編碼的來源
	}
}
*/

import * as Module from '@/module'
import * as Str from '@/strUt'

class Opt{
	effectTag = 'terra_pinyin' /// $
	reverseDbName = 'cangjie5'
}

class Mod extends Module.ModuleStuff{

	get This(){return Mod}
	get name(): string {
		return 'phraseReverse'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt = new Opt()
	get opt() {
		return this._opt
	}
	protected _env: Env

	protected _reverseDb:ReverseLookup = ReverseLookup(this._opt.reverseDbName)
	get reverseDb(){return this._reverseDb}

	protected override _init_opt(env: Env){
		const z = this
		return super._init_opt(env)
	}

	override _init(env: Env): void {
		const z = this
		z._init_opt(env)
		z._reverseDb = ReverseLookup(this._opt.reverseDbName)
	}

	static seekReverseOfStrArr(strArr:string[], reverseLookup:ReverseLookup){
		const ans = [] as string[]
		for(const u of strArr){
			const ua = reverseLookup.lookup(u)
			ans.push(ua)
		}
		return ans
	}

	geneReverseComment(candText:string){
		const z = this
		const charArr = Str.split(candText, '')
		const outArr = z.This.seekReverseOfStrArr(charArr, z.reverseDb)
		return (outArr.join(', '))
	}
}

export const mod = new Mod()

class Filter extends Module.RimeFilter{

	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		const seg = ctx.composition.back()
		if(seg == void 0 || !seg.has_tag(mod.opt.effectTag)){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}

		for(const cand of translation.iter()){
			const comment = mod.geneReverseComment(cand.text)
			const shCand = ShadowCandidate(
				cand
				,cand.type
				,cand.text
				,comment
			)
			yield_(shCand)
		}
		
		// if(seg == void 0){
		// 	return 
		// }
		// log.error(ctx.input)
		// Wat(seg.tags)
	}
}

export const filter = new Filter()