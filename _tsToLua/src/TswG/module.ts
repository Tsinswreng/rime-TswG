/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import { SchemaOpt } from "@/SchemaOpt"
import { ParseType } from "./ts_Type"

interface ModOpt extends kvobj{}

export abstract class ModuleStuff{
	static readonly rootName = 'TswG'
	static readonly sep = '/'

	/** 配置文件中 節點之名 */
	abstract get name():string
	abstract get pathNames():any

	protected abstract _opt:ModOpt
	get opt(){
		return this._opt
	}

	protected abstract _env:Env
	get env():Env{return this._env}
	set env(v:Env){this._env = v}

	protected _inited = false
	/** 
	 * 小狼毫中 每次切換聚焦ʹ窗口旹 各組件會被褈新初始化 調用init方法
	 * //TODO 測試 切換方案後 能否褈新加載
	 */
	get inited(){return this._inited}
	protected set inited(v){this._inited = v}
	

	_init(env:Env){
		const z = this
		z.env = env
		if(z.inited){
			return
		}
		z._init_opt(env)
	}

	protected _init_opt(env:Env):any{
		const z = this
		const item = z.getConfigItem(env)
		if(item == void 0){
			return void 0
		}
		z._opt = SchemaOpt.deep.assignOnlyExistingKeys(z._opt, item)
		z.inited = true
		return z.opt
	}

	/**
	 * 
	 * @param env 
	 * @param path 默認path = MS.rootName + MS.sep + z.name
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

	/**
	 * single type scalar list
	 * 讀數組 並賦入opt相應key
	 * @param keyName as subPath
	 * @param type 默認首元素類型 不得則潙string
	 */
	assignArr(keyName:str, type?:'string'|'number'){
		const z = this
		if(type == void 0){
			//type = (z.opt[keyName])?[0] invalid optional chain
			if(z.opt[keyName] != void 0){
				const first = z.opt[keyName][0]
				const tf = typeof first
				if(tf === 'string'){
					type = 'string'
				}else if(tf === 'number'){
					type = 'number'
				}
				else{
					type = 'string'
				}
			}
		}
		z.opt[keyName] = z.readArr(keyName, type!)
		return z.opt[keyName]
	}

	/**
	 * single type scalar list
	 * @param subPath 
	 */
	readArr(subPath:string):str[]
	readArr(subPath:string, type:'string'):str[]
	readArr(subPath:string, type:'number'):num[]
	readArr(subPath:string, type:'string'|'number'):ParseType<typeof type>[]
	readArr(subPath:string, type:'string'|'number' = 'string'){
		const z = this
		const MS = ModuleStuff
		const fullPath = MS.rootName + MS.sep + z.name + MS.sep + subPath
		const config = z.env.engine.schema.config
		const listConfig = config.get_list(fullPath)
		if(listConfig == void 0){
			return []
		}
		const ans = SchemaOpt.ut.parseSingleTypeScalarList(listConfig, type)
		return ans
	}

	/**
	 * @deprecated not general,
	 * @param env 
	 * @param subPath fullPath = 根節點/此模塊ʹ節點名/${subPath}
	 * @returns 
	 */
	readStrArr(env:Env, subPath:string){
		const z = this
		const MS = ModuleStuff
		const fullPath = MS.rootName + MS.sep + z.name + MS.sep + subPath

		const config = env.engine.schema.config
		const listConfig = config.get_list(fullPath)
		if(listConfig == void 0){
			return []
		}
		const ans = SchemaOpt.ut.parseSingleTypeScalarList(listConfig, 'string')
		return ans
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

// export interface I_RimeSegmentor extends I_RimeComponent{

// }

// export interface I_RimeTranslator extends I_RimeComponent{
// 	func(this:void, input:string, seg:Segment, env:Env)
// }

// export interface I_RimeFilter extends I_RimeComponent{
// 	func(this:void, translation:Translation, env:Env):void
// }


// export interface I_Module{
// 	processor?:I_RimeProcessor
// 	segmentor?:I_RimeSegmentor
// 	translator?:I_RimeComponent
// 	filter?:I_RimeFilter
// }