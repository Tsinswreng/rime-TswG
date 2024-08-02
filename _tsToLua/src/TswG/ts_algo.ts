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
 * 數組分組
 * @param arr 
 * @param memberAmount 足夠分旹每組元素ᵗ數。不足旹餘者作一組。
 * @returns 
 * @instance
 * 
 * 	let arr = [0,1,2,3,4,5,6,7,8,9,10]
 * 	let g = group(arr, 5)
 * [ [ 0, 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ], [ 10 ] ]
 * 
 */
export function group<T>(arr:T[], memberAmount:number){
	const result:T[][] = []
	let unusGroup:T[] = []
	for(let i=0; ; i++){
		unusGroup.push(arr[i])
		if(unusGroup.length===memberAmount){
			result.push(unusGroup)
			unusGroup = []
		}
		if(i===arr.length-1){
			if(unusGroup.length!==0){
				result.push(unusGroup)
			}
			break
		}
	}
	return result
}

/**
 * 對長度一個分組
 * @param length 總長度
 * @param memberPerGrout 每組之元素個數。末尾不足者自成一組
 * @returns 分組區間
 * 如 fn(11, 5) 即 返回 [[0,4], [5,9], [10,10]]
 */
export function lengthGroup(length:integer, memberPerGrout:integer):[integer, integer][]{
	if(memberPerGrout <= 0){
		throw new RangeError(`${memberPerGrout}\nmemberAmount <= 0`)
	}
	const groupCnt = Math.ceil(length / memberPerGrout) //組數
	//const mod = length % memberPerGrout
	const ans = [] as [integer, integer][]
	for(let i = 0; i < groupCnt; i++){
		let start = i*memberPerGrout
		if(i !== groupCnt-1){
			const ua = [start, start+memberPerGrout-1] as [integer, integer]
			ans.push(ua)
		}else{
			const ua = [start, length-1] as [integer, integer]
			ans.push(ua)
		}
	}
	return ans
}

/**
 * //TODO 優化算法
 * //TODO test
 * @param str 
 * @param memberAmount 
 */
export function strGroup(str:string, memberAmount:integer){
	const lenGr = lengthGroup(Str.utf8Len(str), memberAmount)
	const ans = [] as string[]
	for(let i = 0; i < lenGr.length; i++){
		const uGr = lenGr[i]
		const ua = Str.utf8sub(str, uGr[0], uGr[1])
		ans.push(ua)
	}
	return ans
}

/**
 * 
 * @param str 
 * @param memberAmount 
 */

export function groupHandleLongStr<T=any>(str:string, memberAmount:int, fn:(str:string)=>T){
	const strGr = strGroup(str, memberAmount)
	const ans = [] as T[]
	for(const str of strGr){
		// Wat(str)
		// Wat(str.length)
		const ua = fn(str)
		ans.push(ua)
	}
	return ans
}

// export function commitLongStr(engine:Engine, str:string, memberAmount=128){
// 	const strGr = strGroup(str, memberAmount)
// 	for(const str of strGr){
// 		// Wat(str)
// 		// Wat(str.length)
// 		engine.commit_text(str)
// 	}
// }

export function escapeStrToCommit(str:string){
	str = rime_api.regex_replace(str, '\r\n', '\r')
	str = rime_api.regex_replace(str, '\n', '\r')
	return str
}


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
 * @param delimiter ',' 單個字符
 * @returns ['114', '514,810,893']
 */
export function splitByFirstSeparatorChar(str:string, delimiter:string):[string, string]{
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


/**
 * 自作于2024-02-16T02:26:25.000+08:00
 * 測試恐不足
 * AI曰 O(n^m)，其中n是数组的大小，m是数组中每个子数组的平均长度。
[[1], [2,3], [4,5]]// -> [[1,2,4],[1,2,5],[1,3,4],[1,3,5]]
[[1,2],[3],[4,5],[6]] // -> 1346,1356,2346,2356
 * @param arr T[][]
 * @returns T[][]
 */
export function cartesianProduct<T>(arr:T[][]):T[][]{
	if(arr.length===0){return []}
	//const pos = new Array<number>(arr.length)
	const pos = [] as int[]
	//const len = Array<number>(arr.length) // 每個子數組的長度、如[[1],[1,2],[1,2,3,4]]則len潙[1,2,4]
	for(let i=0;i<arr.length;i++){
		const u = arr[i]
		if(u.length === 0){return []}
		pos[i] = 0
		//len[i] = u.length
	}
	let stack = [] as T[]
	const ans:T[][] = []
	let i = 0
	let cnt = 0
	let ipp = false //潙true旹珩i++
	for(;;cnt ++){
		//先固定pos[i]潙0、使i從0迭代至極
		stack.push(
			(arr[i][pos[i]])
		)
		ipp = true
		if(stack.length === arr.length){
			ans.push(stack.slice()) // 取出結果之一ⁿ彈棧
			if(stack.length===0){return ans} // 疑冗
			stack.pop()
			pos[i]++ //i至極後再動pos[i]使從0至極。
			ipp=false
		}
		//pos[i]至極則進位
		if(pos[i]===arr[i].length){
			// pos[i] = 0
			// i--
			// if(stack.length===0){return ans}
			// stack.pop()
			for(;i>=0;){//對pos[i]加一、若滿則進位。如當每位ᵗ最大數皆潙9旹 [1,0,9] 對末位加一即得[1,1,0] (即十進制之109+1=110)。第i位潙len[i]進制、即其最大數潙len[i]-1
				if(pos[i]+1 >= arr[i].length){
					pos[i] = 0
					i--
					if(stack.length===0){return ans}
					stack.pop()
				}else{
					pos[i] += 1
					break
				}
			}
			ipp = false
		}
		if (ipp){i++}
		//if(arr[i]===void 0 || pos[i]>=arr[i].length){break}
	}
	return ans
}


//export function prefixFilter(strArr:str[], prefix){}


/**
 * 進制轉換
 */
export function intToBase(num: int, base: int): string {
	if (base < 2 || base > 36) {
		throw new Error("Base must be in the range 2-36.");
	}

	if (num === 0) {
		return "0";
	}

	const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";
	let isNegative = num < 0;

	if (isNegative) {
		num = -num;
	}

	while (num > 0) {
		const remainder = num % base;
		result = digits[remainder] + result;
		num = Math.floor(num / base);
	}

	if (isNegative) {
		result = "-" + result;
	}

	return result;
}


/**
 * 單個字符轉十六進制字串
 * @param str 
 * @returns 
 */
export function charToHexCode(str:str){
	const codePoint = utf8.codepoint(str)
	const hex = intToBase(codePoint, 16)
	const hexStr = hex+''
	return hexStr
}

/**
 * 字串中諸字符ʹ十六進制碼
 */
export function strToHexCode(str:str, delimiter:str):str{
	const charArr = Str.split(str, '')
	const ans = charArr.map(e=>charToHexCode(e))
	return ans.join(delimiter)
}

/**
 * arr中 是否包含set中任意元素
 * @param arr 
 * @param set 
 * @returns 
 */
export function arrContainsAnyInSet<T>(arr:T[], set:Set<T>|Map<T, any>){
	for(const e of arr){
		if(set.has(e)){
			return true
		}
	}
	return false
}

/**
 * str中 是否包含set中任意字符
 * @param str 
 * @param set 
 * @returns 
 */
export function strContainsAnyInSet(str:str, set:Set<str>|Map<str, any>){
	const chars = Str.split(str, '')
	return arrContainsAnyInSet(chars, set)
}
