/* 
dks 方案專用
*/
import * as Module from '@/module'
import * as Str from '@/strUt'

class Opt{
	reverseName = 'dks_v'
	lower = 'abcdefghijklmnopqrstuvwxyz,.'
	upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<>'
	frontMark_nonUnique = '❗️'
	effectiveTags = ['saffesVassuk']
	pattern = '^[a-z,\\.;]{3}[A-Z<>][a-z,\\.]?$'
}


class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'dks_filterOnAdditionalCode'
	}
	get pathNames(): any {
		return []
	}
	protected _opt = new Opt()
	protected _env: Env

	protected _rvsLkp:ReverseLookup
	get rvsLkp(){return this._rvsLkp}

	protected _upper__lower:Map<str, str> = new Map()
	get upper__lower(){return this._upper__lower}
	
	/** @deprecated */
	protected _effectiveTags = new Set<str>()
	/** @deprecated */
	get effectiveTags(){return this._effectiveTags}

	_init(env: Env): void {
		const z = this
		super._init(env)
		z._rvsLkp = ReverseLookup(z.opt.reverseName)
		z._initLowerEtUpperMaps()
		z._initEffectiveTags()
	}

	protected _initLowerEtUpperMaps(){
		const z = this
		const lowerArr = Str.split(z.opt.lower, '')
		const upperArr = Str.split(z.opt.upper, '')
		for(let i = 0; i < lowerArr.length; i++){
			const l = lowerArr[i]
			const u = upperArr[i]
			z.upper__lower.set(u,l)
		}
	}

	/** @deprecated */
	protected _initEffectiveTags(){
		const z = this
		z._effectiveTags = new Set(z.opt.effectiveTags)
	}

	asciiToLowerAt(str:str, pos:int){

	}

	/**
	 * reverseLookupʸ尋、返集合
	 * @param db 
	 * @param str 
	 * @returns 集合
	 */
	static rvsLkp_set(db:ReverseLookup, str:str){
		const got = db.lookup(str)
		const splt = Str.split(got, ' ')
		return new Set(splt)
	}

	rvsLkp_set(str:str){
		const z = this
		return Mod.rvsLkp_set(z.rvsLkp, str)
	}

	isOn(ctx:Context){
		const z = this
		const seg = ctx.composition.back()
		if(seg == void 0){
			return false
		}
		if(seg.has_tag(z.opt.effectiveTags[0]??'')){
			return true
		}
		return false
	}

	modifyCandComment(cand:Candidate){
		const z = this
		const comment = z.opt.frontMark_nonUnique + cand.comment
		cand.comment = comment
		return ShadowCandidate(
			cand
			,cand.type
			,cand.text
			,comment
		)
	}
}

export const mod = new Mod()

class Filter extends Module.RimeFilter{
	func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		if(!mod.isOn(ctx)){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}


		const cands = [] as Candidate[]
		{
			let i = -1
			for(const cand of translation.iter()){
				i++
				
				cands.push(cand)
				if(i === 1){ //第二次循環
					break
				}
			}
		}
		for(const cand of cands){
			if( rime_api.regex_match(cand.preedit, mod.opt.pattern) ){
				break
			}
			const sh = mod.modifyCandComment(cand)
			yield_(sh)
		}
		for(const cand of translation.iter()){
			if( rime_api.regex_match(cand.preedit, mod.opt.pattern) ){
				break
			} 
			const sh = mod.modifyCandComment(cand)
			yield_(sh)
		}
		
	}
}

export const filter = new Filter()