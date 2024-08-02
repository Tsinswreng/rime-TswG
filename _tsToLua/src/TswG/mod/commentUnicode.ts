import * as Module from '@/module'
import * as Cmd from '@/mod/cmd/ts_cmd'
import * as algo from '@/ts_algo'
import * as Str from '@/strUt'


class Opt{
	switchName='commentUnicode'
}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'commentUnicode'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = new Opt()
	protected _env: Env

	override _init(env: Env): void {
		const z = this
		super._init(env)
		CommentUnicodeSwitch.new().register(Cmd.cmdMod)
	}

	isOn(ctx:Context):bool{
		const z = this
		return ctx.get_option(z.opt.switchName)
	}


	mutComment(cand:Candidate){
		const sh = ShadowCandidate(
			cand
			,cand.type
			,cand.text
			,algo.strToHexCode(cand.text, ' ')
		)
		return sh
		// if(Str.utf8Len(cand.text)===1){
		// 	return fn(cand)
		// }
		// return cand
		//
	}
	
}

export const mod = new Mod()

class CommentUnicodeSwitch extends Cmd.SwitchMaker{
	_cmd_off__on:[string, string] = ['Cu', 'cu']
	_switchNames_on: string[] = [mod.opt.switchName]
}


class Filter extends Module.RimeFilter{

	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		if(!mod.isOn(ctx)){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}
		for(const cand of translation.iter()){
			const ans = mod.mutComment(cand)
			yield_(ans)
		}
	}
}
//d
export const filter = new Filter()