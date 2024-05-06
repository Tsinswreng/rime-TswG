/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import * as Str from '@/strUt'

/** @deprecated */
export const isAPrefixOfB = Str.isAPrefixOfB
// export function isAPrefixOfB(this:void, a:string, b:string){
// 	const inputCode = a
// 	const gotCode = b
// 	const inputCodeLen = utf8.len(inputCode)
// 	if( inputCodeLen == void 0 ){
// 		return false
// 	}
// 	const gotCodeSub = gotCode.slice(0, inputCodeLen)
// 	if( gotCodeSub === inputCode ){
// 		return true
// 	}else{
// 		return false
// 	}
// }

/**
 * //TODO test
 * @param this 
 * @param str abcde
 * @param prefix ab
 * @returns cde
 */
export function removePrefix(this:void, str:string, prefix:string){
	if( prefix.length > str.length ){
		return void 0
	}
	const pre2 = str.slice(0, prefix.length) //0,2 -> ab
	if( pre2 != void 0 && prefix === pre2 ){
		const ans = str.slice(prefix.length)
		return ans
	}
	return void 0
}


/**
 * 五,六,七,八 ->  [[八],[七,八],[六,七,八],[五,六,七,八]]
 * @param arr 
 * @returns 
 */
/**
 * [1,2,3,4] -> [[4],[3,4],[2,3,4],[1,2,3,4]]
 * @param arr 
 * @returns 
 */
export function abc_to_c_bc_abc<T>(arr:T[]){
	const ans = [] as T[][]
	for(let j=0,i = arr.length-1; i>=0; i--,j++){
		const u = arr[i]
		if(j === 0){
			const ua = [u]
			ans.push(ua)
		}else{
			let last = ans[j-1]
			const ua = [u,...last]
			ans.push(ua)
		}
	}
	return ans
}

/**
 * //TODO test
 * @param arr 
 * @param fn 
 * @returns 
 */
export function distinct<T, U>(arr:T[], fn:(ele:T)=>U){
	const ans = [] as T[]
	const set = new Set<U>()
	for(let i = 0; i < arr.length; i++){
		const ele = arr[i]
		const v = fn(ele)
		if(set.has(v)){

		}else{
			ans.push(ele)
			set.add(v)
		}
	}
	return ans
}

/**
 * 
 * @param str '114,514,810,893'
 * @param delimiter ','
 * @returns ['114', '514,810,893']
 */
export function splitByFirstDelimiter(str:string, delimiter:string):[string, string]{
	let pos_delimiter:integer|undefined
	const len = Str.utf8Len(str)
	for(let i = 0; i < len; i++){
		const char = Str.utf8At(str, i)
		if( char === delimiter ){
			pos_delimiter = i //3
			break
		}
	}

	if( pos_delimiter == void 0 ){
		return [str, '']
	}
	const left = Str.utf8sub(str, 0, pos_delimiter-1) // [0,2] -> 114
	const right = Str.utf8sub(str, pos_delimiter+1, len) // [4,end] -> '514,810,893'
	return [left, right]
}