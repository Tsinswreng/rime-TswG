/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import * as Str from '@/strUt'
import { nn } from './ts_Ut'
import { ParseType } from './ts_Type'
/**
 * @deprecated
 * @param conf 
 * @param path 
 * @param parseValueFn
 * @returns 
 */
function parseRecursive(this:void, conf:Config, path:string, parseValueFn:(configValue:ConfigValue)=>any){
	const sep = '/'
	const item = conf.get_item(path)
	if(item == void 0 || item.type === 'kNull'){
		return
	}
	if(parseValueFn == void 0){
		parseValueFn = (cv)=>{
			//return cv.get_string()
			const bool = cv.get_bool()
			const str = cv.get_string()
			const num = cv.get_double()
			const int = cv.get_int()
			
			// log.error('____________')
			// log.error('str: '+str)
			// log.error('num: '+num)
			// log.error('int: '+int)
			// log.error('bool: '+bool)

			// 無法區分 true 與 "true"
			// if( num != void 0 && bool != void 0 && (str === 'true' || str === 'false') ){
			// 	return bool
			// }
			// if(num != void 0){
			// 	return num
			// }
			return str
		}
	}
	const helper = (item:ConfigItem)=>{
		return parseItemDeep(item, parseValueFn)
	}
	return helper(item)
	
}


function parseItemDeep(this:void, item:ConfigItem, parseValueFn:(configValue:ConfigValue)=>any){

	const handle_sca=(item:ConfigItem, ans)=>{
		const v = nn(item.get_value())
		const str = v.get_string()
		return parseValueFn(v)
		
	}

	const handle_map=(item:ConfigItem, ans)=>{
		const map = nn(item.get_map())
		const keys = map.keys()
		for(const k of keys){
			const curItem = map.get(k)
			ans[k] = helper(curItem, parseValueFn)
		}
		return ans
	}

	const handle_list=(item:ConfigItem, ans)=>{
		const list = nn(item.get_list())
		for(let i = 0; i < list.size; i++){
			const curItem = list.get_at(i)
			;(ans as any[])[i] = helper(curItem, parseValueFn)
		}
		return ans
	}


	const helper = (item:ConfigItem, parseValueFn:(configValue:ConfigValue)=>any)=>{
		let ans = {} as any
		
		if(item == void 0 || item.type === 'kNull'){
			return
		}
		const type = item.type
	
	
		switch (type){
			case "kScalar":
				ans = handle_sca(item, ans); break;
			case "kList":
				ans = handle_list(item, ans); break;
			case "kMap":
				ans = handle_map(item, ans); break;
			default: throw new Error('unexpected default in switch-case')
		}
		return ans
	}
}





/**
 * 將configItem遞歸賦予target、並使相應鍵ᵗ類型與target之類型 一致
 * 鍵芝 configItem有洏target無 者ˇ、target不受。含過長ᵗ數組。
 * 如let tar = {a:0, c:[1,2], d: "true"}
let item = {a: '9',b: '8', c:['4','5','6'], d:false} //僞碼
//則賦值後 tar潙 {a:9, c:[4,5], d:"false"}。
賦值前後 tar 中a,c,d之類型皆 同於原。 原c數組長度只有2、故操作後長度尤潙2、而6被捨。前無鍵曰b故後亦無。
 * @param target 
 * @param configV 
 * @returns 
 */
function deepAssignOnlyExistingKeys<Tar=any>(this:void, target:Tar, configItem:ConfigItem){

	//const v = map.get_value(key)
	// function coalesce<Src, Tar>(src:Src, tar:Tar){
	// 	if(tar != void 0){
	// 		return tar
	// 	}
	// 	return src
	// }

	function handle_arr(arr:any[], item:ConfigItem){
		// here obj[key] is an array
		const ans = arr as any[]
		const list = item.get_list()
		if(list == void 0){
			return
		}
		if(list.size == 0){
			return []
		}
		const type = typeof arr[0]
		for(let i = 0; i < list.size; i++){
			const uitem = list.get_at(i)
			// Wat('ans[i]: ')
			// Wat(ans[i])
			if(ans[i] != void 0){
				ans[i] = helper(ans[i] ,uitem, ()=>{})
			}else{
				//const typeFn = seleTypeFn(type, uitem.get_value())
				//ans[i] = seleType(ans[i] ,uitem, type, (ans[i], uitem)=>{return })
			}
			//ans[i] = seleType(ans[i] ,uitem, type, (ans[i], uitem)=>{return }) //(ans[i], uitem)=>{return 1}
			// Wat('uvstr: ')
			// Wat(uitem.get_value()?.get_string())

		}
		return ans
	}

	function handle_kvObj(obj:kvobj, item:ConfigItem){
		// now obj[key] is a kv pair
		const ans = obj as kvobj
		const map = item.get_map()
		if(map == void 0){
			return
		}
		const mapKeys = map.keys()
		for(const mk of mapKeys){
			if( ans[mk] != void 0 ){
				ans[mk] = helper(ans[mk], map.get(mk))
			}
		}
		return ans
	}

	function seleTypeFn(type:jstype, configV:ConfigValue){
		switch (type){
			case 'string':
				return configV.get_string.bind(configV)
			case 'number':
				return configV.get_double.bind(configV)
			//case 'bigint':
			case 'boolean':
				return configV.get_bool.bind(configV)
			//case 'symbol':
			case 'undefined':
				;break;
			case 'object':
				throw new TypeError()
			case 'function':
		}
	}

	const onNil_defau = (obj:any, item:ConfigItem)=>void 0

	function seleType(obj, item:ConfigItem, type:string, onNil:(obj:any, item:ConfigItem)=>any = onNil_defau){
		const scalarV = item.get_value()
		switch (type){
			case 'string':
				obj = scalarV?.get_string()??obj
				;break;
			case 'number':
				obj = scalarV?.get_double()??obj
				;break;
			//case 'bigint':
			case 'boolean':
				obj = scalarV?.get_bool()??obj
				;break;
			//case 'symbol':
			case 'undefined':
				obj = onNil(obj, item)
				;break;
			case 'object':
				//obj[key] = nn( handle_obj(obj, key, v) )
				if(Array.isArray(obj)){
					(obj as any[]) = handle_arr(obj, item)??obj
				}else{
					obj = handle_kvObj(obj, item)??obj
				}
				;break;
			//case 'function':
		}
		return obj
	}

	function helper(this:void, obj:any, item:ConfigItem, onNil=(obj:any, item:ConfigItem)=>void 0){
		const itemType = item.type
		const oriType = typeof obj
		return seleType(obj, item, oriType, onNil)
	}

	// const keys = Object_keys(target as any, 0) // @lua
	// if(keys != void 0 && keys.length > 0){
	// 	if(Array.isArray(target)){

	// 	}else{
	// 		(target as kvobj) = handle_kvObj(target, configItem)
	// 	}
	// 	// for(const k of keys){
	// 	// 	(target as object)[k] = helper(target, configItem) //數組
	// 	// }
	// }else{
	// 	target = helper(target, configItem)
	// }
	target = helper(target, configItem)
	return target
}

//untested
function parseSingleTypeScalarList(list:ConfigList, type:'string'):string[]
function parseSingleTypeScalarList(list:ConfigList, type:'number'):number[]
function parseSingleTypeScalarList(list:ConfigList, type:'boolean'):boolean[]
function parseSingleTypeScalarList(list:ConfigList, type:'string'|'number'|'boolean'):ParseType<typeof type>[]
function parseSingleTypeScalarList(list:ConfigList, type:'string'|'number'|'boolean'){
	const ans = [] as any[]
	function handleStr(uv:ConfigValue){
		return uv.get_string()
	}

	function handleNum(uv:ConfigValue){
		return uv.get_double()
	}
	function handleBool(uv:ConfigValue){
		return uv.get_bool()
	}

	let fn:(uv:ConfigValue)=>any
	switch(type){
		case 'string':
			fn = handleStr
			;break;
		case 'number':
			fn = handleNum
			;break;
		//case 'bigint':
		case 'boolean':
			fn = handleBool
			;break;
		//case 'symbol':
		//case 'undefined':
		//case 'object':
		//case 'function':
		default:
			throw new TypeError(`unexpected default. type=\n${type}`)
	}

	for(let i = 0; i < list.size; i++){
		const uv = list.get_value_at(i)
		if(uv == void 0 || uv.type !== 'kScalar'){
			throw new TypeError(`uv == void 0 || uv.type !== 'kScalar'. uv.type is\n${uv?.type}`)
		}
		const ua = fn(uv)
		if(ua == void 0){
			throw new TypeError(`ua == void 0`)
		}
		ans.push(ua)
	}
	return ans
}




export class SpellerOpt{
	protected constructor(){}
	static new(env:Env){
		const o = new this()
		o._init(env)
		return o
	}

	protected _init(env:Env){
		const z = this
		z._alphabet = env.engine.schema.config.get_string('speller/alphabet')
		z._alphabetCharArr = Str.split(z._alphabet, '')

		for(const char of z.alphabetCharArr){
			const charCode = string.byte(char)
			z.alphabet__keyCode.set(char, charCode)
			z.keyCode__alphabet.set(charCode, char)
		}
	}

	protected _alphabet:string = ''
	get alphabet(){return this._alphabet}

	protected _alphabetCharArr:string[] = []
	get alphabetCharArr(){return this._alphabetCharArr}

	protected _alphabet__keyCode:Map<string, integer> = new Map()
	get alphabet__keyCode(){return this._alphabet__keyCode}

	protected _keyCode__alphabet:Map<integer, string> = new Map()
	get keyCode__alphabet(){return this._keyCode__alphabet}


}

class DeepFn{
	protected constructor(){}
	static readonly parseItem = parseItemDeep
	static readonly assignOnlyExistingKeys = deepAssignOnlyExistingKeys
}

class Ut{
	static readonly parseSingleTypeScalarList = parseSingleTypeScalarList 
}

/** built in switch names */
class SwitchNames{
	readonly ascii_mode = 'ascii_mode'
	readonly simplification = 'simplification'
	readonly full_shape = 'full_shape'
}

export class SchemaOpt{
	protected constructor(){}
	static new(env:Env){
		const o = new this()
		o._init(env)
		return o
	}

	protected _init(env:Env){
		const z = this
		z._speller = SpellerOpt.new(env)
	}

	protected _speller:SpellerOpt
	get speller(){return this._speller}
	
	static readonly switchNames = new SwitchNames()
	
	///** @deprecated */
	//static readonly parsePathRecursive = parseRecursive

	///** @deprecated */
	//static readonly parseItemRecursive = parseItemDeep
	
	static deep = DeepFn
	static ut = Ut
	
}