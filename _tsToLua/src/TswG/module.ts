/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import { SchemaOpt } from "@/SchemaOpt"

interface ModOpt extends kvobj{}

export abstract class ModuleStuff{
	static readonly rootName = 'RimeTswG'
	static readonly sep = '/'

	/** 配置文件中 節點之名 */
	abstract get name():string
	abstract get pathNames():any

	protected abstract _opt:ModOpt
	abstract get opt():ModOpt

	protected abstract _env:Env
	get env():Env{return this._env}
	set env(v:Env){this._env = v}

	_init(env:Env){
		const z = this
		z.env = env
		z._init_opt(env)
	}

	protected _init_opt(env:Env){
		const z = this
		const item = z.getConfigItem(env)
		if(item == void 0){
			return void 0
		}
		z._opt = SchemaOpt.deep.assignOnlyExistingKeys(z._opt, item)
		return z.opt
	}

	/**
	 * 
	 * @param env 
	 * @param path 有默認值
	 * @returns 
	 */
	getConfigItem(env:Env, path?:string){
		const z = this
		const MS = ModuleStuff
		if(path == void 0){
			path = MS.rootName + MS.sep + z.name
		}
		const config = env.engine.schema.config
		return config.get_item(path)
	}



	
}


interface I_RimeComponent{
	init(this:void, env:Env):void
	func(this:void, ...args:any[]):unknown
	fini?(this:void, env:Env):void
}

export class RimeComponent{
	init(this:void, env:Env){

	}
	func(this:void, ...args:any[]){

	}

	fini(this:void, ...args:any[]){
		
	}

}


interface I_RimeProcessor extends I_RimeComponent{
	func(this:void, keyEvent:KeyEvent, env:Env):0|1|2
}

export enum ProcessResult {
	kRejected=0,  // do the OS default processing
	kAccepted=1,  // consume it
	kNoop=2,      // leave it to other processors
}


// export enum ProcessResult{
// 	kReject=0
// 	,kAccept=1
// 	,kNoop=2
// }

export class RimeProcessor extends RimeComponent implements I_RimeProcessor{
	func(this:void, key:KeyEvent, env:Env): ProcessResult {
		return ProcessResult.kNoop
	}
}

export class RimeSegmentor extends RimeComponent{
	/**
	 * 
	 * @param segmentation 
	 * @param env 
	 * @returns true: 交由下一个segmentor处理；false: 终止segmentors处理流程
	 */
	override func(this:void, segmentation:Segmentation, env:Env):boolean{
		return true
	}
}

export class RimeTranslator extends RimeComponent{
	override func(this: void, input:string, segment:Segment, env:Env): void {
		
	}
}

export class RimeFilter extends RimeComponent{
	func(this:void, translation:Translation, env:Env): void {
		for(const cand of translation.iter()){
			yield_(cand)
		}
	}
}

export interface I_RimeSegmentor extends I_RimeComponent{

}

export interface I_RimeTranslator extends I_RimeComponent{
	func(this:void, input:string, seg:Segment, env:Env)
}

export interface I_RimeFilter extends I_RimeComponent{
	func(this:void, translation:Translation, env:Env):void
}


export interface I_Module{
	processor?:I_RimeProcessor
	segmentor?:I_RimeSegmentor
	translator?:I_RimeComponent
	filter?:I_RimeFilter
}