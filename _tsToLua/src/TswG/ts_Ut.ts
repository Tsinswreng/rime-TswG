/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import * as Ty from '@/ts_Type'
import { libTswG } from './_lib/libTswG/libTswG'

//TODO test
export function readFile(fileName:string){
	const file = io.open(fileName, 'r')
	if(file == void 0){
		throw new Error(`file == void 0\n${fileName}\n`)
	}
	let ans = ''
	for(const line of file.lines()){
		ans += line
	}
	return ans
}

export function getMilliseconds():integer|undefined{
	if(libTswG){
		return libTswG()?.getMilliseconds()
	}
}

/**
 * non null
 * @param this 
 * @param v 
 * @param errMsg 
 * @returns 
 */
export function nn<T>(this:void, v:T|undefined|null, errMsg?:string){
	if(v === void 0){
		throw new Error(errMsg)
	}
	return v as T
}

/**
 * nonNullable Array
 * 數組或字符串判空後返回。
 * @param v 
 * @param err 
 * @returns 
 */
export function nna<T>(v:T[]|undefined|null, err?:string|Error):T[]
export function nna<T>(v:string|undefined|null, err?:string|Error):string

export function nna<T>(v:T[]|string|undefined|null, err:string|Error=''){
	if(v == null || v.length === 0){
		if(typeof err === 'string'){
			throw new Error(err)
		}else{
			throw err
		}
	}
	return v
}

/**
 * 
 * @param arr 
 * @param delimiter 
 */
// export function splitArr<T>(arr:T[], delimiter:T[]):T[][]{
// 	for(const e of arr){

// 	}
// }


// 測試代碼
// const testString = "apple,banana,orange";
// const delimiter = ",";
// const result = split(testString, delimiter);
// console.log(result); // 輸出: ["apple", "banana", "orange"]


// function setPrototypeOf(child, parent)
//     local mt = {}
//     mt.__index = parent
//     setmetatable(child, mt)
// end

export class Object_{

}

// export function setPrototypeOf<T>(this:void, o:T, proto){
// 	const mt = {}
// 	mt.__index = proto
// 	//return setmetatable(o, mt)
// 	setmetatable(o,mt)
// 	return o
// }


/**
 * @deprecated
 * @param this 
 * @param o 
 * @param base 
 * @returns 
 */
export function setPrototypeOf<T>(this:void, o:T, base){
	const mt = {}
	mt.__index = base
	//return setmetatable(o, mt)
	//Wat(o)
	setmetatable(o,mt)
	const baseMetatable = getmetatable(base)
	if(baseMetatable != void 0){
		if( type(baseMetatable.__index) === 'function' ){
			mt.__index = baseMetatable.__index
		}
		if( type(baseMetatable.__newindex) === 'function' ){
			mt.__newindex = baseMetatable.__newindex
		}
	}
	return o
}

// /**
//  * modified from tstl lualib
//  * @param target 
//  * @param base 
//  */
// export function setPrototypeOf(target, base){
// 	//target.____super = base
// 	let staticMetatable = setmetatable({__index:base}, base)
// 	setmetatable(target, staticMetatable)
// 	let baseMetatable = getmetatable(base)
// 	if( baseMetatable ){
// 		if( type(baseMetatable.__index) === 'function' ){
// 			staticMetatable.__index = baseMetatable.__index
// 		}
// 		if( type(baseMetatable.__newindex) === 'function' ){
// 			staticMetatable.__newindex = baseMetatable.__newindex
// 		}
// 	}
// 	//setmetatable(target.prototype, base.prototype)
//     // if type(base.prototype.__index) == "function" then
//     //     target.prototype.__index = base.prototype.__index
//     // end
//     // if type(base.prototype.__newindex) == "function" then
//     //     target.prototype.__newindex = base.prototype.__newindex
//     // end
//     // if type(base.prototype.__tostring) == "function" then
//     //     target.prototype.__tostring = base.prototype.__tostring
//     // end

// }




/**
 * @deprecated
 * @param this 
 * @param child 
 * @param parent 
 * @returns 
 */
export function inherit<Ch>(this:void, child:Ch, parent){
	const o = setPrototypeOf(parent, child)
	return o as Ch
}

export function assign(this:void){
	
}

export function nullCoalesce_fn<Tar>(target:Tar){
	return <Src>(src:Src)=>{
		if(src == void 0){return target}
		return src
	}
}

/**
 * Object.keys用于數組旹、tstl所產ᵗ函數ᵗ返ˋ潙 索引從大到小ᵗ數組、與js不符。
 * @param obj 數組或鍵值對象
 * @param baseIndex 基索引。目標潙lua旹應傳入1
 * @returns 
 */
export function Object_keys(obj:any[], baseIndex?:number):number[]
export function Object_keys(obj:kvobj, baseIndex?:number):string[]

export function Object_keys(obj:object, baseIndex:number=0){
	if(typeof obj !== 'object'){return []}
	if(Array.isArray(obj)){
		const ans = [] as number[]
		const _obj:any[] = obj
		for(let i = 0; i < _obj.length; i++){
			ans[i] = i + baseIndex
		}
		return ans
	}else{
		return Object.keys(obj)
	}
}


/**
 * 基本數據類型 類型斷言 帶運行時檢查
 * let a:any = 1
 * let b = primitiveAs(a, 'number') //b:number
 * 
 * @param src 
 * @param target 
 * @param errMsg 
 * @returns 
 */
export function primitiveAs<Target extends string>(src, target:jstype|Target, errMsg:any=''){
	if(typeof src === target){
		return src as Ty.ParseType<Target>
	}else{
		if( typeof errMsg === 'string'){
			throw new Error(errMsg)
		}else{
			throw errMsg
		}
	}

}



export function equal(this:void, t1, t2){
	const a = t1 as LuaTable
	const b = t2 as LuaTable
	if(a === b){
		return true
	}
	if(	type(a) !== type(b) ){
		return false
	}
	if( type(a) === 'table' && type(b) === 'table'){
		for(const [k1,v1] of a){
			//@ts-ignore
			const v2 = b[k1]
			if( v2 == void 0){
				return false
			}else if(v1 !== v2){
				if( type(v1) === 'table' && type(v2) == 'table' ){
					if(!equal(v1,v2)){
						return false
					}
				}else{
					return false
				}
			}
		}
		for(const [k2, _] of b){
			//@ts-ignore
			if(a[k2] == void 0){
				return false
			}
		}
		return true
	}
	return false
}


/**
 * 慎用。尤潙有數組時
 * @param this 
 * @param target 
 * @param src1 
 * @param src2 
 * @returns 
 */
export function toDeepMerge(this:void, target, src1, src2){
	const ans = target
	const o1 = src1 as LuaTable
	const o2 = src2 as LuaTable
	if( o1 == void 0 ){
		throw new Error(`src1 is nil`)
	}
	for(const [k,v] of o1){
		//@ts-ignore
		const typeO1K = type(o1[k])
		//@ts-ignore
		if( typeO1K === 'table' && type(o2[k]) === 'table' ){
			//@ts-ignore
			target[k] = toDeepMerge(target, o1[k], o2[k])
			//@ts-ignore
		}else if( o2[k] != void 0 ){
			//@ts-ignore
			target[k] = o2[k]
		}else{
			//@ts-ignore
			target[k] = v
		}
	}

	for(const [k,v] of o2){
		//@ts-ignore
		if( o1[k] == void 0 ){
			//@ts-ignore
			target[k] = v
		}
	}
	return target
}

// let a = {
// 	a:1
// 	,b:2
// }
// a.length

class Pa{
	protected constructor(){

	}

	static new(prop:{
		age
	}){

	}
	age=18
}

class Ch extends Pa{

	name= 'ch'

}

