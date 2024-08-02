/** 
 *
 */

import * as Module from '@/module'
import * as Str from '@/strUt'
class Opt{
	hiraganaName = 'hiragana'
}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'mixJp'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = new Opt()
	get opt(){return this._opt}
	protected _env: Env

	protected _hiraganaSchema:Schema
	get hiraganaSchema(){return this._hiraganaSchema}

	protected _hiraganaTranslator:Translator
	get hiraganaTranslator(){return this._hiraganaTranslator}

	protected _hiraganaSegmentor:ModSegmentor
	get hiraganaSegmentor(){return this._hiraganaSegmentor}
	
	protected _mem:Memory
	get mem(){return this._mem}

	_init_hiragana(env:Env){
		const z = this
		z._hiraganaSchema = Schema(z.opt.hiraganaName)
		z._hiraganaTranslator = Component.Translator(
			z.env.engine
			, z.hiraganaSchema
			, 'translator'
			, 'script_translator'
		)

	}

	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._mem = Memory(env.engine, Schema(z.opt.hiraganaName))
		z._init_hiragana(env)
	}

	segmentAddTag(segment:Segment, tag:str){
		segment.tags = Set_.add(segment.tags, Set_([tag]))
		return segment.tags
	}
}

export const mod = new Mod()

class ModSegmentor extends Module.RimeSegmentor{
	override init(this: void, env: Env): void {
		mod._init(env)
	}
	override func(this: void, segmentation: Segmentation, env: Env): boolean {
		const ctx = env.engine.context
		const input = segmentation.input
		// log.info(ctx.input)
		// log.error(input)
		// Wat(segmentation.back()?.tags)
		//const segment = segmentation.back()
		const segment = ctx.composition.back()
		if(segment != void 0){
			//segment.tags = Set_(['hiragana'])
			//segment.tags = Set_(['ipa'])
		}
		// log.error('1')
		// Wat(ctx.composition.back()?.tags)
		
		// if(segment != void 0){
		// 	//segment.tags = Set_.add(segment.tags, Set_(['hiragana']))
		// 	mod.segmentAddTag(segment, 'hiragana')
		// 	//segment.tags = Set_.sub(segment.tags, Set_(['abc']))
		// 	segment.tags = Set_([])
		// 	log.error('1')
		// 	Wat(segment.tags)
		// 	Wat(segmentation.back()?.tags)
		// }

		return true
	}
}


class ModTranslator extends Module.RimeTranslator{
	override func(this: void, input: string, segment: Segment, env: Env): void {
		const ctx = env.engine.context
		//Wat(segment.tags)
		
		// log.error('2')// 
		// const hiraganaSchema = Schema('hiragana') 
		// const trltor = Component.Translator(env.engine, env.engine.schema, "translator", 'script_translator')
		// const translation = mod.hiraganaTranslator.query(input, segment)
		// // const translation = trltor.query('a', segment)
		// for(const cands of translation.iter()){
		// 	Wat(cands.text)
		// }
		
	}
}



class ModFilter extends Module.RimeFilter{
	override func(this: void, translation: Translation, env: Env): void {
		for(const cand of translation.iter()){
			yield_(cand)
		}
	}
}

export const segmentor = new ModSegmentor()
export const translator = new ModTranslator()
//export const filter = new Filter()