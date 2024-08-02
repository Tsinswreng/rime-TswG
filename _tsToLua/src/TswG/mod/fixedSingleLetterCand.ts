import * as Module from '@/module'

const letter__char = new Map([
	['q', '一']
	,['w', '我']
	,['e', '它']
	,['r', '了']
	,['t', '的']
	,['y', '有']
	,['u', '話']
	,['i', '過']
	,['o', '他']
	,['p', '不']
	,['a', '出']
	,['s', '所']
	,['d', '是']
	,['f', '吧']
	,['g', '下']
	,['h', '好']
	,['j', '四']
	,['k', '個']
	,['l', '也']
	,['z', '在']
	,['x', '可']
	,['c', '再']
	,['v', '次']
	,['b', '被']
	,['n', '你']
	,['m', '嗎']
	,['.', '。']
	//,['', '']
])

class Filter extends Module.RimeFilter{
	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		if(ctx.input.length > 1){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}
		const cands = [] as Candidate[]
		let target:Candidate
		for(const cand of translation.iter()){
			const got = letter__char.get(ctx.input)
			if(cand.text === got){
				cand.quality += 1
				target = cand
				break
			}
			cands.push(cand)
		}

		{
			let i = 0
			if(i === 0 && target! != void 0){
				yield_(target)
			}
			for(const cand of cands){
				yield_(cand)
			}
			i++
		}

		// for(let i = 0, cand = translation.iter(); ;){

		// }
		
		for(const cand of translation.iter()){
			yield_(cand)
		}
	}
}

export const filter = new Filter()
