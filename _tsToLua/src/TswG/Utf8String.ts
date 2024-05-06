/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

/** @deprecated */
export class Utf8String{
	protected constructor(){}
	static new(str:string){
		// const got = Utf8String._str__u8str.get(str)
		// if(got != void 0){
		// 	return got
		// }
		const o = new this()
		o._length = utf8.len(str)
		for(let i = 0; i < o._length; i++){
			const char = utf8.char(utf8.codepoint(str, i+1))
			o._data[i] = char
		}
		// Utf8String._str__u8str.set(str, o)
		return o
	}

	// static split(str:string, delimiter:string){

	// }

	// protected static _str__u8str:Map<string, Utf8String>
	// protected static _u8

	protected _data:string[] //每個元素都是一個utf8字符

	protected _raw:string = ''
	get raw(){return this._raw}


	protected _length:integer = 0
	get length(){return this._length}

	toString(){
		return this.raw
	}

	static toUtf8CharArr(str:string){
		const u8Obj = Utf8String.new(str)
		return u8Obj._data
	}
}
