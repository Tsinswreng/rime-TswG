/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */
import * as Module from '@/module'
import * as Str from '@/strUt'
import * as algo from '@/ts_algo'
import { SchemaOpt } from '@/SchemaOpt'
//import {mod as predictMod, segmentor} from '@/mod/ts_predict'

//import {mod as commentQualityMod} from '@/mod/ts_commentQuality'
import { nn, readFile } from '@/ts_Ut'
//import {mod as VocaMod} from '@/mod/voca/mod'
import * as clib from '@/_lib'


//Wat(VocaMod.opt)//t

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
	argSeparator = ','
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
		op.argStr = param
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

	/**
	 * 執行完整ʹ命令、需包括提示符
	 * $u,4e2d,64 -> 中,,,
	 * @param imput 
	 * @param env 
	 * @returns 
	 */
	eval(imput:str, env:Env):Module.ProcessResult{
		const fullCmd = Str.removePrefixSafe(imput, cmdMod.opt.prompt)
		if(fullCmd == void 0){
			return pr.kNoop
		}
		
		const [cmdName, param] = algo.splitByFirstSeparatorChar(fullCmd, cmdMod.opt.argSeparator)
		const op = cmdMod.getOp(cmdName, param, env)
		if(op == void 0){
			log.error(`no such command:\n${imput}`)
			const keys = cmdMod.cmd__op.keys()
			for(const k of keys){
				Wat(k)
			}
			return pr.kNoop
		}

		cmdMod.ready = true
		if(cmdMod.ready){
			cmdMod.ready = false
			op.run()
			//log.error(`op.run()`)
			return pr.kAccepted
		}

		return pr.kNoop
	}

}
export const cmdMod = Mod.new()

export interface Runnable<Arg=any[], Ret=any>{
	run():Ret
}

export abstract class Operation implements Runnable<void, void>{
	abstract get cmdName():string

	protected _argStr?:string
	/** 完整ʹ參數字串 */
	get argStr(){return this._argStr}
	set argStr(v){
		const z = this
		this._argStr = v
		if(z._argStr == void 0 || z._argStr.length === 0){
			z.args = []
			return
		}
		z.args = Str.split(z._argStr, cmdMod.opt.argSeparator)
	}

	protected _args:str[]
	get args(){return this._args}
	protected set args(v){this._args = v}
	

	protected _env:Env
	get env(){return this._env}
	set env(v){this._env = v}

	abstract run()
}


export class SwitchOperation extends Operation{
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

export abstract class SwitchMaker {
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



// class WriteDictYaml{
// }


const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this()
		return o
	}

	override init(this: void, env: Env): void {
		cmdMod._init(env)
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		const isAsciiMode = ctx.get_option(SchemaOpt.switchNames.ascii_mode)
		if(isAsciiMode){
			return pr.kNoop
		}

		// if(mod.opt.useSpace){

		// }

		if( !cmdMod.submitKey(key) ){
			return pr.kNoop
		}

		return cmdMod.eval(ctx.input, env)

		//return pr.kNoop
	}
}


class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}

	override func(this: void, input: string, segment: Segment, env: Env): void {
		//Wat(mod.timeToYieldCand)
		if( !cmdMod.timeToYieldCand ){
			return
		}
		cmdMod.timeToYieldCand = false
		for(const cand of cmdMod.candsToYield){
			cand.start = segment.start
			cand._end = segment._end
			yield_(cand)
			log.error(`Wat(cand.text)`)
			Wat(cand.text)
		}
		cmdMod.candsToYield = []

	}
}

export const processor = Processor.new()
export const translator = Translator.new()