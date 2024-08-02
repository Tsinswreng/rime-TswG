// esno "D:\_code\voca\src\backend\FileVoca.ts" "D:\Program Files\Rime\User_Data\voca\signal" "D:\Program Files\Rime\User_Data\voca\in" "D:\Program Files\Rime\User_Data\voca\out"

import * as Module from '@/module'
import * as Srv from '@/mod/ngaq/svc'
import {cmdMod as cmdMod} from '@/mod/cmd/ts_cmd'
import * as Str from '@/strUt'

//log.error(tostring(cmdMod))
const userDir = rime_api.get_user_data_dir()

export class NgaqCmd{
	load='load'
	sort='sort'
	start='start'
	learnByIndexOrUndo='learnByIndexOrUndo'
	save='save'
	restart='restart'
	prepare='prepare'
	putWordsToLearn='putWordsToLearn'
	discardChange = 'discardChange'
}

class Keys{
	quit = 'grave'
	rmb = 'Right'
	fgt = 'Left'
	prepare = 'p'
	putWordsToLearn = 'l'
	save = 's'
	clear = 'c'
	start = 'o'
	restart = 'r'
	readEtShow = 'f'
	help = 'h'
	discardChange = 'd'
}

class Opt{
	switchName='ngaq'
	cmdOff = 'J'
	cmdOn = 'j'
	io = new Srv.IoOpt()
	keys = new Keys()
	charToPush = '^'
	ngaqCmd = new NgaqCmd()
	cmdArgsDelimiter = ','
	outFileDelimiter = '\t'

}

class Mod extends Module.ModuleStuff{
	static new(){
		const z = new this()
		return z
	}
	get name(): string {
		return 'ngaq'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.')
	}
	protected _opt = new Opt()
	get opt() {
		return this._opt
	}
	protected _env: Env

	protected _ngaq:Srv.RimeNgaq
	get ngaq(){return this._ngaq}

	timeToYield = false

	protected _lines:string[] = []
	get lines(){return this._lines}
	set lines(v){this._lines = v}

	protected _tsv:string[][] = []
	get tsv(){return this._tsv}
	set tsv(v){this._tsv = v}

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
		z._ngaq = Srv.RimeNgaq.new(z._opt.io, z.opt.cmdArgsDelimiter)
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
			const [text, comment] = Str.split(line, mod.opt.outFileDelimiter)
			const c = Candidate(
				'ngaq'
				,_start
				,_end
				,text
				,comment??''
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
 
	setPrompt(ctx:Context, prompt:string){
		const segment = ctx.composition.back()
		if(segment != void 0){
			segment.prompt = prompt
		}
	}
	promptMean(ctx:Context){
		const z = this
		const curPos = z.getSelectedIndex(ctx)
		if(curPos==void 0){
			log.error(`curPos==void 0`)
			return pr.kAccepted
		}
		const tr = z.tsv[curPos]
		const prompt = tr[2]??''
		z.setPrompt(ctx, prompt)
		
	}

	refreshInput(ctx:Context){
		const z = this
		//
		if(ctx.input === ''){
			ctx.push_input(z.opt.charToPush)
		}else if(ctx.input.length === z.opt.charToPush.length){
			ctx.push_input(z.opt.charToPush)
		}else{
			ctx.pop_input(1)
		}
		//let ᅠ=1; ᅠ=''
	}

	// this_is_my_function(){}
	// thisIsMyFunction(){}
	// thisᅠisᅠmyᅠfunction(){} U+1160
	//Tsinswreng‮‮喵~‭
}

export const mod = Mod.new()
import { SwitchMaker } from '@/mod/cmd/ts_cmd'
class NgaqSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = [mod.opt.cmdOff,mod.opt.cmdOn]
	_switchNames_on: string[] = [mod.opt.switchName]
}
NgaqSwitch.new().register(cmdMod)


const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		// Wat(key.repr())//t 
		if(!mod.isOn(ctx)){
			return pr.kNoop
		}
		const keyCode = key.keycode
		const repr = key.repr()
		const keys = mod.opt.keys
		const cmds = mod.opt.ngaqCmd
		
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
		// 	mod.ngaq.sendSignal()
		// }

		if(repr === keys.prepare){
			mod.ngaq.execEtSignal(mod.opt.ngaqCmd.prepare)
		}

		if(repr === keys.start){
			const ans = mod.ngaq.execEtSignal(mod.opt.ngaqCmd.start)
			//ctx.push_input(mod.opt.charToPush)
			//Wat(mod.lines)//t 
		}

		if(repr === keys.rmb){
			//mod.ngaq.exec()
			const curPos = mod.getSelectedIndex(ctx)
			if(curPos==void 0){
				log.error(`curPos==void 0`)
				return pr.kAccepted
			}
			const ans = mod.ngaq.execEtSignal(cmds.learnByIndexOrUndo, curPos+'', mod.wordEventRepr.rmb)
			mod.promptMean(ctx)
			//Wat(ans)
			return pr.kAccepted
		}

		if(repr === keys.fgt){
			const curPos = mod.getSelectedIndex(ctx)
			if(curPos==void 0){
				log.error(`curPos==void 0`)
				return pr.kAccepted
			}
			const ans = mod.ngaq.execEtSignal(cmds.learnByIndexOrUndo, curPos+'', mod.wordEventRepr.fgt)
			//Wat(ans)
			mod.promptMean(ctx)
			return pr.kAccepted
		}

		if(repr === keys.save){
			const ans = mod.ngaq.execEtSignal(cmds.save)
			ctx.clear()
			//Wat(ans)  
			return pr.kAccepted
		}
// 
		if(repr === keys.clear){
			ctx.clear()
		}

		if(repr === keys.readEtShow){
			mod.timeToYield = true
			mod.lines = mod.ngaq.readOut()
			mod.tsv = mod.lines.map(e=>Str.split(e, mod.opt.outFileDelimiter))
			//ctx.push_input(mod.opt.charToPush)
			mod.refreshInput(ctx)
			// Wat(mod.lines)
		}

		if(repr === keys.putWordsToLearn){
			mod.ngaq.execEtSignal(cmds.putWordsToLearn)
		}

		if(repr === keys.restart){
			mod.ngaq.execEtSignal(cmds.restart)
			ctx.clear()
		}

		if(repr === keys.discardChange){
			mod.ngaq.execEtSignal(cmds.discardChange)
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

class Filter extends Module.RimeFilter{
	
	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		if(!mod.isOn(ctx)){
			for(const cand of translation.iter()){
				yield_(cand)
			}
			return
		}
		for(const cand of translation.iter()){
			yield_(cand)
		}
	}
	
}

export const processor = new Processor()
export const translator = new Translator()
export const filter = new Filter()