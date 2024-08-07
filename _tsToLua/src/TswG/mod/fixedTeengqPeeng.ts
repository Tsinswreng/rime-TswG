/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import * as Module from '@/module'
import * as Str from '@/strUt'
import * as json from '@/_lua_lib/ison'
import { rlog } from '@/Log'
import { AnsiColors as AC } from '@/AnsiColors'

class OptKeyNames{
	keyOnClearStatus = 'keyOnClearStatus'
	keyOnCommitRawInput = 'keyOnCommitRawInput'
	keyOnCommitWithKNoop = 'keyOnCommitWithKNoop'
}
const optKeyNames = new OptKeyNames()

const Release = 'Release+'


class Opt{
	static new(){
		const o = new this()
		return o
	}

	/** 固定碼長 */
	fixedLength = 3
	logLevel?:str = ""
	switchName = "fixedTeengqPeeng"
	/** 㕥清除本輪輸入狀態之諸鍵 */
	keyOnClearStatus = [
		'Return'
	]

	keyOnCommitRawInput = [
		'Return'
	]

	keyOnCommitWithKNoop = [

	]


}

class CharEtInput{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof CharEtInput.new>){
		const z = this
		z.char = args[0]
		z.input = args[1]
		return z
	}

	static new(char:str, input:str){
		const z = new this()
		z.__init__(char, input)
		return z
	}

	char = ''
	input = ''
}

class TeengqPeeng{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof TeengqPeeng.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected _stack = [] as CharEtInput[]
	get stack(){return this._stack}
	protected set stack(v){this._stack = v}

	protected _str = ''
	/** 用于在prompt中顯示 */
	protected get str(){return this._str}
	protected set str(v){this._str = v}
	

	push(charEtInput: CharEtInput){
		const z = this
		z.stack.push(charEtInput)
		z.str += charEtInput.char
	}

	pop(){
		const z = this
		const ans = z.stack.pop()
		//z._str = z.allCharToStr()
		z.str = z.stack.map(x=>x.char).join('')
		return ans
	}

	allCharToStr(){
		//return this.stack.map(x=>x.char).join('')
		return this.str
	}

	allInputToStr(){
		return this.stack.map(x=>x.input).join('')
	}

	getPrompt(){
		return this.str
	}

	hasHistory(){
		return this.stack.length > 0
	}
	
}




class Status{
	protected _firstCharInCand = ''
	get firstCharInCand(){return this._firstCharInCand}
	set firstCharInCand(v){this._firstCharInCand = v}
	
	protected _teengqPeeng = TeengqPeeng.new()
	get teengqPeeng(){return this._teengqPeeng}
	protected set teengqPeeng(v){this._teengqPeeng = v}
	
	protected _neoInput = ''
	get neoInput(){return this._neoInput}
	set neoInput(v){this._neoInput = v}
	
	protected _curCharEtInput: CharEtInput|undef
	get curCharEtInput(){return this._curCharEtInput}
	set curCharEtInput(v){this._curCharEtInput = v}

	protected _toCommit = ''
	get toCommit(){return this._toCommit}
	set toCommit(v){this._toCommit = v}
	
	protected _readyToCut = false
	get readyToCut(){return this._readyToCut}
	set readyToCut(v){this._readyToCut = v}
	
	
}



class Mod extends Module.ModuleStuff{
	static new(){
		const o = new this()
		return o
	}
	get name(): string {
		return 'fixedTeengqPeeng'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = Opt.new()
	get opt(){
		return this._opt
	}
	protected _env: Env

	protected _status = new Status()
	get status(){return this._status}
	protected set status(v){this._status = v}

	protected _keyOnCommitRawInput = new Set()
	get keyOnCommitRawInput(){return this._keyOnCommitRawInput}
	protected set keyOnCommitRawInput(v){this._keyOnCommitRawInput = v}

	protected _keyOnClearStatus = new Set()
	get keyOnClearStatus(){return this._keyOnClearStatus}
	protected set keyOnClearStatus(v){this._keyOnClearStatus = v}

	protected _keyOnCommitWithKNoop = new Set()
	get keyOnCommitWithKNoop(){return this._keyOnCommitWithKNoop}
	protected set keyOnCommitWithKNoop(v){this._keyOnCommitWithKNoop = v}
	

	protected _commitConne:Connection
	get commitConne(){return this._commitConne}
	protected set commitConne(v){this._commitConne = v}

	protected _selectConne:Connection
	get selectConne(){return this._selectConne}
	protected set selectConne(v){this._selectConne = v}

	protected _timeToYield = false
	get timeToYield(){return this._timeToYield}
	set timeToYield(v){this._timeToYield = v}

	logFilePath = rime_api.get_user_data_dir()+'/TswG_log'

	protected _logFile = File.open(this.logFilePath, 'w')
	get logFile(){return this._logFile}
	protected set logFile(v){this._logFile = v}

	// /** @lateinit */
	// protected _alphabet__keyCode:Map<str, int>
	// get alphabet__keyCode(){return this._alphabet__keyCode}
	// protected set alphabet__keyCode(v){this._alphabet__keyCode = v}

	protected _schemaOpt:SchemaOpt
	get schemaOpt(){return this._schemaOpt}
	protected set schemaOpt(v){this._schemaOpt = v}

	protected _keyCode__alphabet:Map<int, str>
	get keyCode__alphabet(){return this._keyCode__alphabet}
	protected set keyCode__alphabet(v){this._keyCode__alphabet = v}
	
	protected _spellerProcessor:Processor
	get spellerProcessor(){return this._spellerProcessor}
	protected set spellerProcessor(v){this._spellerProcessor = v}
	
	
	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._initNotifier(env.engine.context)
		Switch.new().register(cmdMod)
		z.schemaOpt = SchemaOpt.new(z.env)
		z._keyCode__alphabet = z.schemaOpt.speller.keyCode__alphabet
		z.spellerProcessor = Component.Processor(env.engine, '', 'speller')
	}

	protected override _init_opt(env: Env){
		const z = this
		super._init_opt(env)
		z.assignArr(optKeyNames.keyOnClearStatus)
		z.assignArr(optKeyNames.keyOnCommitRawInput)
		z.assignArr(optKeyNames.keyOnCommitWithKNoop)
		z.keyOnCommitRawInput = new Set(z.opt.keyOnCommitRawInput)
		z.keyOnClearStatus = new Set(z.opt.keyOnClearStatus)
		z.keyOnCommitWithKNoop = new Set(z.opt.keyOnCommitWithKNoop)
	}

	_initNotifier(ctx:Context){
		const z = this
		z.commitConne = ctx.commit_notifier.connect(z.fn_onCommit(ctx))
		z.selectConne = ctx.select_notifier.connect(z.fn_onSelect(ctx))
		//z._selectConne = ctx.select_notifier.connect(z.onsele2)
	}

	isOn(ctx:Context){
		const z = this
		return ctx.get_option(z.opt.switchName)
	}

	fn_onCommit(_ctx:Context){
		const z = this
		return (ctx:Context=_ctx)=>{
			z.clearStatus()
		}
	}

	fn_onSelect(_ctx:Context){
		const z = this
		return (ctx:Context=_ctx)=>{
			const seleT = z.getSelectedCandText(ctx)
			const t = ctx.get_selected_candidate()?.text
		}
	}

	clearStatus(){
		const z = this
		z.status = new Status()
	}

	getSelectedCandText(ctx:Context){
		const cand = ctx.get_selected_candidate()
		if(cand == void 0){
			return ''
		}
		return cand.text
	}

	getCandAt(ctx:Context, index:int){
		return(ctx.composition.back()?.menu.get_candidate_at(index))
	}

	setPrompt(ctx:Context, prompt:string){
		const lastSeg = ctx.composition.back()
		if(lastSeg != void 0){
			lastSeg.prompt = prompt
			return true
		}
		return false
	}
//
	_write(content:str){
		const z = this
		return write(z.logFilePath, 'a', content)
	}

	logStr(v=''){
		const z = this
		const lv = z.opt.logLevel
		if(lv == void 0 || lv === "" || typeof log[lv] !== 'function'){
			return
		}
		
		rlog[lv](v)
	}

	log(...v:any[]){
		const z = this
		const lv = z.opt.logLevel
		if(lv == void 0 || lv === "" || typeof log[lv] !== 'function'){
			return
		}
		const sb = [] as str[]
		for(const item of v){
			if(typeof item === 'string'){
				sb.push(item)
			}else{
				const j = json.encode(item)
				sb.push(j)
			}
		}
		sb.push('\n')
		const ans = sb.join('')
		z._write(ans)
		//log.warning(ans)
		// z.logFile.write(ans)
		// z.logFile.write('\n')
		// z.logFile.flush()
		//z.logStr(ans)
	}

	sleep(sec:num){
		os.execute('timeout '+sec)
	}

	commit_text(v:str){
		const z = this
		z.env.engine.commit_text(v)
	}

	clearLog(){
		const z = this
		write(z.logFilePath, 'w', '')
	}


}
export const mod = Mod.new()

const pr = Module.ProcessResult

import { SwitchMaker, cmdMod } from '@/mod/cmd/ts_cmd'
import { File, write } from '@/File'
import { SchemaOpt } from '@/SchemaOpt'

const hocMod = mod
class Switch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Ft', 'ft']
	_switchNames_on = [hocMod.opt.switchName, hocMod.opt.switchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}


class ModProcessor extends Module.RimeProcessor{

	override init(this: void, env: Env): void {
		mod._init(env)
		//mod.log('init')
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		
		const ctx = env.engine.context
		const repr = key.repr()
		const input = ctx.input
		// mod.log(AC.Reset)
		// mod.clearLog()
		// mod.log(AC.White ,key.keycode)
		// mod.log(repr)
		// mod.log(AC.BgBlue, `$repr: `,repr, AC.Reset)
		// mod.log(AC.BgRed, `$input: `, input, AC.Reset)

		if(!mod.isOn(ctx)){
			return pr.kNoop
		}

		if(repr === 'BackSpace'){
			if(!ctx.is_composing() 
				|| (!mod.status.teengqPeeng.hasHistory() && input.length === 0)
			){
				mod.clearStatus()
				return pr.kNoop
			}
			if(mod.status.teengqPeeng.hasHistory() && input.length === 1){
				const pop = mod.status.teengqPeeng.pop()
				if(pop == void 0){
					return pr.kNoop
				}
				ctx.clear()
				ctx.push_input(pop.input)
				mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
				return pr.kAccepted
			}
		}//~if(repr === 'BackSpace')

		if(!ctx.is_composing()){
			return pr.kNoop
		}

		if(mod.keyOnClearStatus.has(repr)){
			mod.clearStatus()
		}
	
		if(repr === 'space'){ 
			const candText = mod.getSelectedCandText(ctx)
			mod.status.toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			if(mod.status.toCommit === ""){
				throw new Error('toCommit is empty')
			}
			mod.commit_text(mod.status.toCommit)
			mod.clearStatus()
			ctx.clear()
			return pr.kAccepted
		}//~if(repr === 'space')

		const reprNum = tonumber(repr)
		if(reprNum != void 0){
			const candText = mod.getCandAt(ctx, reprNum-1)?.text??''
			const toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			mod.commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			return pr.kAccepted
		}//~if(reprNum != void 0)

		if(mod.keyOnCommitWithKNoop.has(repr)){
			const candText = mod.getSelectedCandText(ctx)
			const toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			mod.commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			return pr.kNoop
		}//~if(mod.keyOnCommitWithKNoop.has(repr))
		
		if(mod.opt.keyOnCommitRawInput.includes(repr)){
			const historyInput = mod.status.teengqPeeng.allInputToStr()
			const toCommit = historyInput+input
			mod.commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			return pr.kAccepted
		}//~if(mod.opt.keyOnCommitRawInput.includes(repr))

		if(input.length < mod.opt.fixedLength){
			mod.status.readyToCut = false
		}

		if(input.length === mod.opt.fixedLength){
			if(!mod.status.readyToCut){
				const candText = mod.getSelectedCandText(ctx)
				mod.status.curCharEtInput = CharEtInput.new(candText, input)
				mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
				mod.status.readyToCut = true
				return pr.kNoop
			}//~if(!mod.status.readyToCut)
		}//~if(input.length === mod.opt.fixedLength)
		
		//if(input.length === mod.opt.fixedLength+1)
		
		if(mod.keyCode__alphabet.has(key.keycode)){// && !repr.startsWith(Release)
			// const _pr = mod.spellerProcessor.process_key_event(key)
			mod.log(AC.White, `if(mod.keyCode__alphabet.has(key.keycode) && repr.startsWith(Release))`, AC.Reset)
			if(mod.status.readyToCut && !repr.startsWith(Release)){
				const toPush = mod.status.curCharEtInput
				if(toPush != void 0){
					mod.status.teengqPeeng.push(toPush)
				}
				mod.status.neoInput = Str.utf8sub(input, mod.opt.fixedLength, mod.opt.fixedLength)
				ctx.clear() //清除所有輸入
				ctx.push_input(mod.status.neoInput)
				mod.status.readyToCut = false
				mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
				return pr.kNoop
			}//~if(mod.status.readyToCut)
		}//~if(mod.keyCode__alphabet.has(key.keycode) && repr.startsWith(Release))

		mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
		return pr.kNoop
	}
}


class Segmentor extends Module.RimeSegmentor{
	static new(){
		const o = new this()
		return o
	}

	override func(this: void, segmentation: Segmentation, env: Env): boolean {
		return true

	}
}

class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}
	override func(this: void, input: string, segment: Segment, env: Env): void {

	}
}

export const processor = new ModProcessor()
export const segmentor = Segmentor.new()
export const translator = Translator.new()