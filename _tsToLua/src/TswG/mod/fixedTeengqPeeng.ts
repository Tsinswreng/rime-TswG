/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import * as Module from '@/module'
import * as Str from '@/strUt'
import * as json from '@/_lua_lib/ison'
import { tlog } from '@/Log'


class OptKeyNames{
	keyOnClearStatus = 'keyOnClearStatus'
	keyOnCommitRawInput = 'keyOnCommitRawInput'
	keyOnCommitWithKNoop = 'keyOnCommitWithKNoop'
}
const optKeyNames = new OptKeyNames()

class Opt{
	static new(){
		const o = new this()
		return o
	}

	/** 固定碼長 */
	fixedLength = 3
	logLevel?:str = ""
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
		z._str = z.allCharToStr()
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

	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._initNotifier(env.engine.context)
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

	logStr(v=''){
		const z = this
		const lv = z.opt.logLevel
		if(lv == void 0 || lv === "" || typeof log[lv] !== 'function'){
			return
		}
		
		tlog[lv](v)
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
		const ans = sb.join('')
		z.logStr(ans)
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
		const repr = key.repr()
		const input = ctx.input
		function rec(){
			mod.logStr(`$input: ${input}`)
			mod.log(`$curCharEtInput: `,mod.status.curCharEtInput)
			mod.log(`$stack: `,mod.status.teengqPeeng.stack)
		}
		mod.log(`----outer----`)
		rec()
		//
		function commit_text(v:str){
			mod.log(`----commit_text----`)
			rec()
			env.engine.commit_text(v)
			mod.log(`----end commit_text----`)
		}

		
		
		if(!ctx.is_composing()){
			return pr.kNoop
		}

		//Wat(env.engine.compose(ctx))

		if(repr === 'BackSpace'){
			if(!ctx.is_composing() 
				|| (!mod.status.teengqPeeng.hasHistory() && input.length <= 1)
			){
				mod.clearStatus()
				return pr.kNoop
			}
			if(mod.status.teengqPeeng.hasHistory() && input.length === 1){
				const pop = mod.status.teengqPeeng.pop()
				if(pop === void 0){
					return pr.kNoop
				}
				ctx.clear()
				ctx.push_input(pop.input)
				return pr.kAccepted
			}
		}

		if(mod.keyOnClearStatus.has(repr)){
			mod.clearStatus()
		}
		
		//commit 1st
		if(repr === 'space'){ 
			mod.log(`----if space----`)
			rec()
			const candText = mod.getSelectedCandText(ctx)
			const toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			mod.log(`----endif space----`)
			rec()
			return pr.kAccepted
		}

		// commit from 2nd
		const reprNum = tonumber(repr)
		if(reprNum != void 0){
			mod.log(`----if reprNum----`)
			rec()
			const candText = mod.getCandAt(ctx, reprNum-1)?.text??''
			const toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			//env.engine.commit_text(toCommit)
			commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			mod.log(`----endif reprNum----`)
			rec()
			return pr.kAccepted
		}

		if(mod.keyOnCommitWithKNoop.has(repr)){
			mod.log(`----if keyOnCommitWithKNoop----`)
			rec()
			const candText = mod.getSelectedCandText(ctx)
			const toCommit = mod.status.teengqPeeng.allCharToStr()+candText
			//env.engine.commit_text(toCommit)
			commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			mod.log(`----endif keyOnCommitWithKNoop----`)
			rec()
			return pr.kNoop
		}
		
		if(mod.opt.keyOnCommitRawInput.includes(repr)){
			mod.log(`----if commit raw----`)
			rec()
			const historyInput = mod.status.teengqPeeng.allInputToStr()
			const toCommit = historyInput+input
			//env.engine.commit_text(toCommit)
			commit_text(toCommit)
			mod.clearStatus()
			ctx.clear()
			mod.log(`----endif commit raw----`)
			rec()
			return pr.kAccepted
		}

		if(input.length === mod.opt.fixedLength){
			mod.log(`----if fixedLength----`)
			rec()
			const candText = mod.getSelectedCandText(ctx)
			//mod.status.firstCharInCand = Str.utf8sub(candText, 0, 0)
			mod.status.curCharEtInput = CharEtInput.new(candText, input)
			mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
			mod.log(`----endif fixedLength----`)
			rec()
			return pr.kNoop
		}
		
		
		
		if(input.length === mod.opt.fixedLength+1){
			//mod.teengqPeeng += mod.status.firstCharInCand
			mod.log(`----if fixedLength+1 ----`)
			rec()
			const toPush = mod.status.curCharEtInput
			if(toPush != void 0){
				mod.status.teengqPeeng.push(toPush)
			}
			
			mod.status.neoInput = Str.utf8sub(input, mod.opt.fixedLength, mod.opt.fixedLength)
			
			ctx.clear() //清除所有輸入
			//ctx.pop_input(mod.opt.fixedLength+1) //清除指定個數的輸入
			ctx.push_input(mod.status.neoInput)
			mod.setPrompt(ctx, mod.status.teengqPeeng.getPrompt())
			mod.log(`----endif fixedLength+1 ----`)
			rec()
			return pr.kNoop
		}

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

export const processor = new Processor()
export const segmentor = Segmentor.new()
export const translator = Translator.new()