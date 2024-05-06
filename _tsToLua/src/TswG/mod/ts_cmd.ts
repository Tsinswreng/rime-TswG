/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/
import * as Module from '@/module'
import * as Str from '@/strUt'
import * as algo from '@/ts_algo'
import { SchemaOpt } from '../SchemaOpt'
import {mod as predictMod, segmentor} from '@/mod/ts_predict'
import { libTswG } from '@/_lib/libTswG/libTswG'



// let timer = nn(libTswG)()
// Wat(timer)
// Wat(timer?.setTimeout)
// //@ts-ignore
// Wat(timer?.setTimeout(()=>{
// 	log.error('a')
// },15000))

// timer?.setTimeout(()=>{
// 	Wat('123')
// }, 1000)
// let i = 0;
// const timer = libTswG!()
// timer?.setTimeout(()=>{
// 	Wat(i)
// },1000)


class PathNames{

}

class Opt {
	static new(){
		const o = new this()
		return o
	}
	prompt = '$'
	paramDelimiter = ','
	useSpace = false
	submitKey = 'space'
}

class Mod extends Module.ModuleStuff{

	static new(){
		const z = new this()
		return z
	}

	get name(): string {return 'ts_cmd'}
	
	get pathNames(): any {
		throw new Error('Method not implemented.');
	}

	protected _ready = false
	get ready(){return this._ready}
	set ready(v){this._ready = v}

	protected _env: Env

	protected _opt = Opt.new()
	get opt(){return this._opt}

	protected _cmd__op = new Map<string, Operation>()
	get cmd__op(){return this._cmd__op}

	protected _timeToYieldCand = false
	get timeToYieldCand(){return this._timeToYieldCand}
	set timeToYieldCand(v){this._timeToYieldCand = v}

	protected _candsToYield:Candidate[] = []
	get candsToYield(){return this._candsToYield}
	set candsToYield(v){this._candsToYield = v}


	override _init(env: Env): void {
		const z = this
		super._init(env)
	}

	addCands(cands:Candidate[]){
		const z = this
		z._candsToYield.push(...cands)
	}

	yieldCands(){
		const z = this
		z.timeToYieldCand = true
	}
	
	submitKey(key:KeyEvent){
		return key.repr() === 'space'
	}

	getOp(cmdName:string, param:string, env:Env){
		const z = this
		const op = z._cmd__op.get(cmdName)
		if(op == void 0){
			return op
		}
		op.env = env
		op.param = param
		return op
	}

	addOp(op:Operation, name=op.cmdName){
		const z = this
		z._cmd__op.set(name, op)
		// log.error(name)
		// for(const k of z.cmd__op.keys()){
		// 	Wat(k)
		// }
	}

	testAddOp(op:Operation, name=op.cmdName){
		const z = this
		z.addOp(op, name)
		log.error(name)
		for(const k of z.cmd__op.keys()){
			Wat(k)
		}
	}

	

}
export const mod = Mod.new()

export interface Runnable<Arg=any[], Ret=any>{
	run():Ret
}

export abstract class Operation implements Runnable<void, void>{
	abstract get cmdName():string

	protected _param?:string
	get param(){return this._param}
	set param(v){this._param = v}

	protected _env:Env
	get env(){return this._env}
	set env(v){this._env = v}

	abstract run()
}


class SwitchOperation extends Operation{
	static new(cmdName:string, runnable:Runnable){
		const o = new this()
		o.__init__(cmdName, runnable)
		return o
	}
	protected __init__(cmdName:string, runnable:Runnable){
		const o = this
		o._cmdName = cmdName
		o._runnable = runnable
		o._runnable.run = o._runnable.run.bind(this)
	}

	protected _cmdName:string
	get cmdName(): string {
		return this._cmdName
	}
	protected _runnable:Runnable
	run() {
		this._runnable.run()
	}
	
}

abstract class SwitchMaker {
	protected constructor(){}
	static new():SwitchMaker{
		//@ts-ignore
		const o = new this()
		const z = o as SwitchMaker
		z.__init__()
		return o
	}
	protected __init__(){
		const z = this
		if(z._switchNames_off == void 0){
			z._switchNames_off = z._switchNames_on
		}
	}
	abstract _cmd_off__on:[string, string]
	abstract _switchNames_on: string[]
	_switchNames_off: string[]

	geneInst(switchNames:string[], stateToSet:boolean, index:integer= stateToSet?1:0){
		const mk = this
		const ans = SwitchOperation.new(
			mk._cmd_off__on[index]
			, {
				run(this:SwitchOperation){
					const z = this
					const ctx = z._env.engine.context
					for(const switch_ of switchNames){
						ctx.set_option(switch_, stateToSet)
					}
					ctx.clear()
				}
			}
		)
		return ans
	}

	register(mod:Mod){
		const z = this
		const onInst = z.geneInst(z._switchNames_on, true)
		const offInst = z.geneInst(z._switchNames_off, false)
		mod.addOp(onInst)
		mod.addOp(offInst)
		return mod
	}
}

class PredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['P', 'p']
	_switchNames_on = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}
PredictSwitch.new().register(mod)

class ActivePredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Ap', 'ap']
	_switchNames_on = [predictMod.opt.activeSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}
ActivePredictSwitch.new().register(mod)

class PassivePredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Pp', 'pp']
	_switchNames_on = [predictMod.opt.passiveSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}
PassivePredictSwitch.new().register(mod)



import {mod as commentQualityMod} from '@/mod/ts_commentQuality'
import { nn, readFile } from '../ts_Ut'

class CommentQualitySwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Q', 'q']
	_switchNames_on: string[] = [commentQualityMod.opt.switchName]
}
CommentQualitySwitch.new().register(mod)

class SimplificationSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['S', 's']
	_switchNames_on: string[] = [SchemaOpt.switchNames.simplification]
}
SimplificationSwitch.new().register(mod)

import {mod as VocaMod} from '@/mod/voca/mod'
Wat(VocaMod.opt)//t
class VocaSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = [VocaMod.opt.cmdOff,VocaMod.opt.cmdOn]
	_switchNames_on: string[] = [VocaMod.opt.switchName]
}
VocaSwitch.new().register(mod)


class Help extends Operation{
	get cmdName(): string {
		return 'help'
	}
	run() {
		const keys = mod.cmd__op.keys()
		log.error('_______________________________________')
		for(const k of keys){
			Wat(k)
		}
	}	
}
mod.addOp(new Help())

class TestYieldCand extends Operation{
	static i = 0
	get cmdName(): string {
		return 'ca'
	}
	run() {
		const z = this
		mod.timeToYieldCand = true
		mod.addCands([Candidate('a', 0,0, (TestYieldCand.i++)+'', 'TEST')])
		//mod.yieldCands()
	}
}
mod.addOp(new TestYieldCand())

class LoadString extends Operation{
	get cmdName(): string {
		return 'l'
	}
	run() {
		const z = this
		if(z.param == void 0){return}
		const fn = load(`return ${z.param}`)
		const ans = fn()
		z.env.engine.commit_text(ans)
	}
}
mod.addOp(new LoadString())


//似一次性上屏字符串長度有個數限制
class UnicodeToChar extends Operation{
	get cmdName(): string {
		return 'u'
	}
	run() {
		const z = this
		if(z.param == void 0){return}
		
		const args = Str.split(z.param, mod.opt.paramDelimiter)
		const hexStr = args[0]
		const cntStr = args[1]
		const cnt = tonumber(cntStr)??1
		const baseHex = tonumber(hexStr, 16)
		if(baseHex == void 0){return}
		const ans = z.multi(baseHex, cnt)
		
		z.env.engine.commit_text(ans)
	}

	toChar(code:integer){
		return utf8.char(code)
	}

	multi(base:integer, cnt:integer){
		const z = this
		let ans = ''
		for(let i = 0; i < cnt; i++){
			const ua = z.toChar(base+i)
			ans+=ua
		}
		return ans
	}
}
mod.addOp(new UnicodeToChar())

class UnixMills extends Operation{
	get cmdName(): string {
		return 'unixt'
	}
	run() {
		const z = this
		if(libTswG == void 0){
			return
		}
		const mills = libTswG()?.getMilliseconds()
		z.env.engine.commit_text(mills==void 0?'':mills+'')
	}
}
mod.addOp(new UnixMills())

class TestReadFile extends Operation{
	get cmdName(): string {
		return 'file'
	}
	run() {
		const z = this
		const text = readFile('D:/_code/voca/src/shared/WordWeight/Schemas/MyWeight.ts')
		Wat(text)
	}
}
mod.addOp(new TestReadFile())


const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this()
		return o
	}
	override init(this: void, env: Env): void {
		mod._init(env)
	}
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		const isAsciiMode = ctx.get_option(SchemaOpt.switchNames.ascii_mode)
		if(isAsciiMode){
			return pr.kNoop
		}

		// if(mod.opt.useSpace){

		// }

		if( !mod.submitKey(key) ){
			return pr.kNoop
		}

		const fullCmd = Str.removePrefixSafe(ctx.input, mod.opt.prompt)
		if(fullCmd == void 0){
			return pr.kNoop
		}
		
		const [cmdName, param] = algo.splitByFirstDelimiter(fullCmd, mod.opt.paramDelimiter)
		const op = mod.getOp(cmdName, param, env)
		if(op == void 0){
			log.error(`no such command:\n${ctx.input}`)
			const keys = mod.cmd__op.keys()
			for(const k of keys){
				Wat(k)
			}
			return pr.kNoop
		}

		mod.ready = true
		if(mod.ready){
			mod.ready = false
			op.run()
			//log.error(`op.run()`)
			return pr.kAccepted
		}

		return pr.kNoop
	}
}


class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}

	override func(this: void, input: string, segment: Segment, env: Env): void {
		//Wat(mod.timeToYieldCand)
		if( !mod.timeToYieldCand ){
			return
		}
		mod.timeToYieldCand = false
		for(const cand of mod.candsToYield){
			cand.start = segment.start
			cand._end = segment._end
			yield_(cand)
			log.error(`Wat(cand.text)`)
			Wat(cand.text)
		}
		mod.candsToYield = []

	}
}

export const processor = Processor.new()
export const translator = Translator.new()