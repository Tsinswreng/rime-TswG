/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/


/**
 * //TODO test
 * @param str 
 * @param index from 0
 * @returns 
 */
export function utf8At(str:string, index:integer){
	return utf8sub(str, index, index)
}

export function utf8Len(this:void, str:string){
	const ans = utf8.len(str)
	return ans
}


/**
 *
 * @lua
 * index starts from 1
 * [i, j]
 * //TODO test empty string
 * @param s 
 * @param i 
 * @param j 
 */
export function lua_utf8sub(this:void, s:string, i:integer=1, j:integer=-1){
	if(i < 1 || j < 1){
		const n = utf8Len(s)
		if( i < 0 ){
			i = n + 1 + i
		}
		if( j < 0 ){
			j = n + 1 +j
		}
		if( i < 0 ){
			i = 1
		}else if( i > n ){
			i = n
		}
		if( j < 0 ){
			j = 1
		}else if(j > n){
			j = n
		}
	}
	if( j < i ){return ''}

	i = utf8.offset(s, i)
	j = utf8.offset(s, j+1)
	if(i != void 0 && j != void 0){
		return string.sub(s, i, j-1)
	}else if(i != void 0){
		return string.sub(s, i)
	}else{
		return ''
	}
	throw new Error(`str:${s}\ni:${i}\nj:${j}`)
}


/**
 * //TODO test empty string
 * @param this 
 * @param str 
 * @param i from 0
 * @param j included  [i, j]
 * @returns return lua_utf8sub(str, i+1, j+1)
 */
export function utf8sub(this:void, str:string, i:integer, j:integer){
	return lua_utf8sub(str, i+1, j+1)
}


/**
 * 
 * @param str 
 * @returns 
 */
function strToUtf8CharArr(str:string){
	const ans = [] as string[]
	for(let i = 0; i < utf8.len(str); i++){
		ans[i] = lua_utf8sub(str, i+1, i+1)
		//ans[i] = utf8.char(utf8.codepoint(str, i+1))
	}
	return ans
}

// export function join<T>(arr:T[], delimiter:string=''){
// 	let ans = ''
// 	for(let i = 0; i < arr.length; i++){
// 		if(i === arr.length-1){
// 			break
// 		}
// 		ans += arr[i]+delimiter

// 	}
// 	return ans
// }

/** 
 * 末尾多一個delimiter
 */
export function join_deprecated<T>(arr:T[], delimiter:string=''){
	let ans = ''
	for(let i = 0; i < arr.length; i++){
		ans += arr[i]+delimiter
	}
	return ans
}

export function split(this:void, str: string, delimiter: string): string[] {

	if(delimiter.length === 0){
		return strToUtf8CharArr(str)
	}

    const result: string[] = [];
    let startIndex = 0;
    let delimiterIndex = str.indexOf(delimiter);

    while (delimiterIndex !== -1) {
        result.push(str.substring(startIndex, delimiterIndex));
        startIndex = delimiterIndex + delimiter.length;
        delimiterIndex = str.indexOf(delimiter, startIndex);
    }

    result.push(str.substring(startIndex));
    return result;
}


/**
 * @param a 
 * @param b 
 * @returns 
 */
export function isAPrefixOfB(this:void, a:string, b:string){
	const pre = a
	const strLen = utf8.len(pre)
	if( strLen == void 0 ){
		return false
	}
	const gotCodeSub = b.slice(0, strLen)
	if( gotCodeSub === pre ){
		return true
	}else{
		return false
	}
}

export function isPrefix(str:string, prefix:string){
	return isAPrefixOfB(prefix, str)
}

/**
 * 
 * @param str 
 * @param prefix 
 * @returns return undefined when prefix is not prefix of str
 */
export function removePrefixSafe(str:string, prefix:string){
	if( ! isPrefix(str, prefix) ){
		return 
	}
	return removePrefixUnsafe(str, prefix)
}

/**
 * //TODO test
 * @param str 
 * @param prefix 
 * @returns 
 */
export function removePrefixUnsafe(str:string, prefix:string){
	return lua_utf8sub(str, utf8Len(prefix)+1, utf8Len(str))
}


/**
 * //TODO test
 * @lua
 * @param char 
 * @returns 
 */
export function isAsciiChar(char:string){
	if(Lua.len(char) !== 1){
		return false
	}
	const byte = string.byte(char)
	if(0 <= byte || byte <= 127 ){
		return true
	}
	return false
}
export const printableAsciiChars = ` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`
export const fullShapeAscii = `　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～`
class HalfFullShape{


	upper: Array<[string, string]> = [
		['A', 'Ａ'],
		['B', 'Ｂ'],
		['C', 'Ｃ'],
		['D', 'Ｄ'],
		['E', 'Ｅ'],
		['F', 'Ｆ'],
		['G', 'Ｇ'],
		['H', 'Ｈ'],
		['I', 'Ｉ'],
		['J', 'Ｊ'],
		['K', 'Ｋ'],
		['L', 'Ｌ'],
		['M', 'Ｍ'],
		['N', 'Ｎ'],
		['O', 'Ｏ'],
		['P', 'Ｐ'],
		['Q', 'Ｑ'],
		['R', 'Ｒ'],
		['S', 'Ｓ'],
		['T', 'Ｔ'],
		['U', 'Ｕ'],
		['V', 'Ｖ'],
		['W', 'Ｗ'],
		['X', 'Ｘ'],
		['Y', 'Ｙ'],
		['Z', 'Ｚ']
	];
	
	lower: Array<[string, string]> = [
		['a', 'ａ'],
		['b', 'ｂ'],
		['c', 'ｃ'],
		['d', 'ｄ'],
		['e', 'ｅ'],
		['f', 'ｆ'],
		['g', 'ｇ'],
		['h', 'ｈ'],
		['i', 'ｉ'],
		['j', 'ｊ'],
		['k', 'ｋ'],
		['l', 'ｌ'],
		['m', 'ｍ'],
		['n', 'ｎ'],
		['o', 'ｏ'],
		['p', 'ｐ'],
		['q', 'ｑ'],
		['r', 'ｒ'],
		['s', 'ｓ'],
		['t', 'ｔ'],
		['u', 'ｕ'],
		['v', 'ｖ'],
		['w', 'ｗ'],
		['x', 'ｘ'],
		['y', 'ｙ'],
		['z', 'ｚ']
	];
	
	number: Array<[string, string]> = [
		['0', '０'],
		['1', '１'],
		['2', '２'],
		['3', '３'],
		['4', '４'],
		['5', '５'],
		['6', '６'],
		['7', '７'],
		['8', '８'],
		['9', '９']
	];
	
	symbol: Array<[string, string]> = [
		['+', '＋'],
		['-', '－'],
		['*', '＊'],
		['/', '／'],
		['=', '＝'],
		['%', '％'],
		[',', '，'],
		['&', '＆'],
		['@', '＠'],
		['#', '＃'],
		['!', '！'],
		['?', '？'],
		['^', '＾'],
		['_', '＿'],
		['(', '（'],
		[')', '）'],
		['[', '［'],
		[']', '］'],
		['{', '｛'],
		['}', '｝'],
		['<', '＜'],
		['>', '＞'],
		['|', '｜'],
		['.', '．'],
		[':', '：'],
		[';', '；'],
		["'", '＇'],
		['"', '＂'],
		['`', '｀'],
		['\\', '＼']
	];
	
	space: Array<[string, string]> = [
		[' ', '　']
	];
	
	all = [
		...this.upper
		,...this.lower
		,...this.number
		,...this.symbol
		,...this.space
	]
	
	half__full = new Map(this.all)
	full__half = (()=>{
		const z = this
		const ans = new Map<string, string>()
		for(const pair of z.all){
			const half = pair[0]
			const full = pair[1]
			ans.set(full, half)
		}
		return ans
	})()
	
	
	
}