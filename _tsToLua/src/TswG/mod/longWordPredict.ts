import * as Module from '@/module'
import * as Str from '@/strUt'
import { SchemaOpt } from '@/SchemaOpt'

const t2s = Opencc('t2s.json')

const short__long = new Map([
	['北京信息', '北京信息科技大學']
	,['廣西壯族', '廣西壯族自治區']
	,['中華人民', '中華人民共和國']
	,['計算機科', '計算機科學與技術']
])

class Opt{
	effectMinLength = 4
}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'longWordPredict'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt = new Opt()
	
	protected _env: Env

	override _init(env: Env): void {
		const z = this
		super._init(env)
		//z._mem = Memory(env.engine, env.engine.schema)
		//z._reverseLookup = ReverseLookup('dks')///$
	}

	// protected _mem:Memory
	// get mem(){return this._mem}
	// protected _reverseLookup:ReverseLookup
	// get reverseLookup(){return this._reverseLookup}

	isSimp(ctx:Context){
		const z = this
		return ctx.get_option(SchemaOpt.switchNames.simplification)
	}

}

export const mod = new Mod()

class Filter extends Module.RimeFilter{

	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, translation: Translation, env: Env): void {
		// const habere = mod.mem.dict_lookup('北', true, 64)
		// Wat(habere)
		// for(const de of mod.mem.iter_dict()){
		// 	Wat(de.text)
		// }
		// const ans = mod.reverseLookup.lookup_stems('黃')
		// Wat(ans)
		const ctx = env.engine.context
		for(const cand of translation.iter()){
			if(Str.utf8Len(cand.text) >= 4){
				const gotLong = short__long.get(cand.text)
				if(gotLong != void 0){
					yield_(cand)
					const longCand_ = Candidate(
						'longWordPredict'
						,cand._start
						,cand._end
						,gotLong
						,''
					)
					let ans:Candidate = longCand_
					if(mod.isSimp(ctx)){
						ans = ShadowCandidate(longCand_, longCand_.type, longCand_.text, longCand_.comment)
					}
					yield_(ans)
					continue
				}
			}
			yield_(cand)
		}
	}
}

export const filter = new Filter()