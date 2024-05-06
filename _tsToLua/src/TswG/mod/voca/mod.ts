// esno "D:\_code\voca\src\backend\FileVoca.ts" "D:\Program Files\Rime\User_Data\voca\signal" "D:\Program Files\Rime\User_Data\voca\in" "D:\Program Files\Rime\User_Data\voca\out"

import * as Module from '@/module'
import * as Srv from '@/mod/voca/svc'
import {mod as cmdMod} from '@/mod/ts_cmd'
import * as Str from '@/strUt'

const userDir = rime_api.get_user_data_dir()

export class VocaCmd{
	load='load'
	sort='sort'
	start='start'
	learnByIndex='learnByIndex'
	save='save'
	restart='restart'
	prepare='prepare'
}

class Keys{
	quit = 'grave'
	rmb = 'Right'
	fgt = 'Left'
	prepare = 'p'
	save = 's'
	clear = 'c'
	restart = 'r'
}

class Opt{
	switchName='voca'
	cmdOff = 'J'
	cmdOn = 'j'
	io = new Srv.IoOpt()
	keys = new Keys()
	charToPush = '^'
	vocaCmd = new VocaCmd()
	cmdArgsDelimiter = ','
	text__commentDelimiterOfCand = '\t'

}

class Mod extends Module.ModuleStuff{
	static new(){
		const z = new this()
		return z
	}
	get name(): string {
		return 'voca'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt = new Opt()
	get opt() {
		return this._opt
	}
	protected _env: Env

	protected _voca:Srv.RimeVoca
	get voca(){return this._voca}

	timeToYield = false

	protected _lines:string[] = []
	get lines(){return this._lines}
	set lines(v){this._lines = v}

	protected _cands:Candidate[] = []
	get cands(){return this._cands}
	set cands(v){this._cands = v}

	protected _wordEventRepr = {
		rmb: 'r'
		,fgt: 'f'
	}
	get wordEventRepr(){return this._wordEventRepr}

	override _init(env: Env): void {
		super._init(env)
		const z = this
		z._voca = Srv.RimeVoca.new(z._opt.io, z.opt.cmdArgsDelimiter)
	}

	isOn(ctx:Context){
		const z = this
		return ctx.get_option(z.opt.switchName)
	}
	// turnOn(ctx:Context){
	// 	const z = this
		
	// }
	turnOff(ctx:Context){
		const z = this
		return ctx.set_option(z.opt.switchName, false)
	}

	geneCands(lines:string[], _start:integer, _end:integer){
		const z = this
		const ans = [] as Candidate[]
		for(const line of lines){
			const [text, comment] = Str.split(line, mod.opt.text__commentDelimiterOfCand)
			const c = Candidate(
				'voca'
				,_start
				,_end
				,text
				,comment
			)
			ans.push(c)
		}
		z._cands = ans
		return ans
	}

	getSelectedIndex(ctx:Context){
		const segment = ctx.composition.back()
		return segment?.selected_index
	}
}

export const mod = Mod.new()
const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		//Wat(key.repr())//t
		if(!mod.isOn(ctx)){
			return pr.kNoop
		}
		const keyCode = key.keycode
		const repr = key.repr()
		const keys = mod.opt.keys
		const cmds = mod.opt.vocaCmd
		//Wat(cmdMod) // 訪問cmdMod則棧溢出
		if(repr === mod.opt.keys.quit){
			mod.turnOff(ctx)
		}
		// if(repr.length === 1){
		// 	ctx.push_input(repr)
		// }

		
		if(repr === 'Up' || repr === 'Down' || repr === 'BackSpace'){
			return pr.kNoop
		}

		// if(repr === 's'){ //test
		// 	mod.voca.sendSignal()
		// }

		if(repr === keys.prepare){
			mod.voca.exec(mod.opt.vocaCmd.prepare)
		}

		if(repr === 'o'){
			mod.timeToYield = true
			Wat(repr)
			const ans = mod.voca.exec(mod.opt.vocaCmd.start)
			mod.lines = ans
			ctx.push_input(mod.opt.charToPush)
			//Wat(mod.lines)//t
		}

		if(repr === keys.rmb){
			//mod.voca.exec()
			const curPos = mod.getSelectedIndex(ctx)
			if(curPos==void 0){
				log.error(`curPos==void 0`)
				return pr.kAccepted
			}
			const ans = mod.voca.exec(cmds.learnByIndex, curPos+'', mod.wordEventRepr.rmb)
			Wat(ans)
			return pr.kAccepted
		}

		if(repr === keys.fgt){
			const curPos = mod.getSelectedIndex(ctx)
			if(curPos==void 0){
				log.error(`curPos==void 0`)
				return pr.kAccepted
			}
			const ans = mod.voca.exec(cmds.learnByIndex, curPos+'', mod.wordEventRepr.fgt)
			Wat(ans)
			return pr.kAccepted
		}

		if(repr === keys.save){
			const ans = mod.voca.exec(cmds.save)
			Wat(ans)
			return pr.kAccepted
		}

		if(repr === keys.clear){
			ctx.clear()
		}

		//return pr.kNoop
		return pr.kAccepted
	}
}

class Translator extends Module.RimeTranslator{
	override func(this: void, input: string, segment: Segment, env: Env): void {
		if(!mod.timeToYield){
			return
		}
		mod.timeToYield = false
		const cands = mod.geneCands(mod.lines, segment._start, segment._end)
		for(const cand of cands){
			yield_(cand)
		}
	}
}

export const processor = new Processor()
export const translator = new Translator()