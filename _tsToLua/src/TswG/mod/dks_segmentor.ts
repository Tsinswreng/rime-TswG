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
}

class Mod extends Module.ModuleStuff{
	static new(){
		const o = new this()
		return o
	}
	get name(): string {
		throw new Error('Method not implemented.')
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt = Opt.new()
	get opt(){
		return this._opt
	}
	protected _env: Env
	
}
export const mod = Mod.new()


class Segmentor extends Module.RimeSegmentor{
	static new(){
		const o = new this()
		return o
	}

	override func(this: void, segmentation: Segmentation, env: Env): boolean {
		// const ctx= env.engine.context
		// const preedit = ctx.get_preedit()
		// Wat(preedit.text)
		// const back = segmentation.back()
		// Wat(back?._start)
		// Wat(back?._end)
		
		// if(back != void 0){
		// 	if(segmentation.input.length > 3){
		// 		back.status = 'kConfirmed'

		// 		// const neoSeg = Segment(back._end+1, segmentation.input.length)
		// 		// neoSeg.tags = back.tags
		// 		// segmentation.add_segment(neoSeg)
		// 	}
		// }
		// log.error(`preedit`)
		// Wat(preedit.text)
		// log.error(`Wat(segmentation.input)`)
		// Wat(segmentation.input)
		// if(popB != void 0){
		// 	log.error(`Wat(popB.start)`)
		// 	Wat(popB.start)
		// 	log.error(`Wat(popB._end)`)
		// 	Wat(popB._end)
		// 	log.error(`Wat(popB.tags)`)
		// 	Wat(popB.tags)
		// 	//popB.tags['hiragana'] = true
		// 	//@ts-ignore
		// 	//let tag2 = popB.tags + Set_({'hiragana':true})
		// 	//let tag2 = popB.tags + {'hiragana':true}
		// 	popB.tags = Set_.add(popB.tags, {'hiragana':true})
		// 	log.error(`Wat(segmentation.back()?.tags)`)
		// 	Wat(segmentation.back()?.tags)
			
		// 	// //@ts-ignore
		// 	// for(const [k,v] in (popB.tags)){
		// 	// 	Wat(k)
		// 	// 	Wat(v)
		// 	// 	Wat('\n')
		// 	// }
		// 	// for(let i = 0; i < 10; i++){
		// 	// 	const cand = popB.get_candidate_at(i)
		// 	// 	log.error(i+'')
		// 	// 	Wat(cand.text)
		// 	// }
			
		// }
		


		/* const back = segmentation.back()
		log.error(`Wat(segmentation.input)`)
		Wat(segmentation.input)
		log.error(`Wat(back?.status)`)
		Wat(back?.status) */
		
		// if(segmentation.input.length > 6){
		// 	const back = segmentation.back()
		// 	//back.close()
		// 	Wat(back._start)
		// 	Wat(back._end)
		// 	Wat(back.status)
		// 	segmentation.add_segment(back)
		// 	return false
		// }
		return true
	}
}

class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}
	override func(this: void, input: string, segment: Segment, env: Env): void {
		// const cand = Candidate('',segment._start,segment._end,'114514','')
		// cand.quality = 9999999999999999
		// yield_(cand)
	}
}

export const segmentor = Segmentor.new()
export const translator = Translator.new()