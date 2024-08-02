import * as Module from '@/module'
import { mapTranslation } from '@/ts_rimeUtil'

class Opt{

}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'ipa'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = new Opt()
	get opt(){return this._opt}
	protected _env: Env;
	
}

const hiragana = Schema('hiragana')
const dks = Schema('dks')
const ipa_yunlong = Schema('ipa_yunlong')
let ipaTrltor :Translator
const pr = Module.ProcessResult
class ModProcessor extends Module.RimeProcessor{

	override init(this: void, env: Env): void {
		ipaTrltor = Component.Translator(env.engine, ipa_yunlong, 'translator', 'script_translator')
	}
	
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		return 2
		const repr = key.repr()
		const ctx = env.engine.context
		Wat(ctx.input)
		
		const translation = ipaTrltor.query(
			ctx.input
			, ctx.composition.back()??Segment(0,0)
		)
		if(translation != void 0){
			mapTranslation(translation, (e)=>{
				log.error(e.text)
			})
		}

		
		//Wat(env.engine.active_engine.schema?.schema_id)
		// if(repr === 'grave'){ 
		// 	env.engine.apply_schema(hiragana)
		// }
		// if(repr === 'slash'){
		// 	env.engine.apply_schema(dks)
		// }

		return pr.kNoop
	}
}

export const processor = new ModProcessor()
