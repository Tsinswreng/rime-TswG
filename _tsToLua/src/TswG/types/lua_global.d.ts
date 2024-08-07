/* 
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/


declare type integer = number
declare type nil = undefined|null

declare namespace Lua{
	type table = object|LuaTable
	type luaType = "nil"
	| "number"
	| "string"
	| "boolean"
	| "table"
	| "function"
	| "thread"
	| "userdata"

	type ioOpenMode =
	"r" //读模式。
	 | "w" //- 写模式。
	 | "a" //- 追加模式。
	 | "r+" //-- 更新模式，所有之前的数据都保留。
	 | "w+" //-- 更新模式，所有之前的数据都删除。
	 | "a+" //-- 追加更新模式，所有之前的数据都保留，只允许在文件尾部做写入。
	 | "rb" //-- 读模式。（二进制方式）
	 | "wb" //-- 写模式。（二进制方式）
	 | "ab" //-- 追加模式。（二进制方式）
	 | "r+b"// -- 更新模式，所有之前的数据都保留。（二进制方式）
	 | "w+b"// -- 更新模式，所有之前的数据都删除。（二进制方式）
	 | "a+b"// -- 追加更新模式，所有之前的数据都保留，只允许在文件尾部做写入。（二进制方式）

	interface Table_static{
		insert(this:void, table)
	}
	interface LuaString_static{
		sub(this:void, s: string|number, i: integer, j?: integer):string
		/**
		 * Returns the internal numerical codes of the characters s[i], s[i+1],
		..., s[j]. The default value for i is 1; the default value for j
		is i. These indices are corrected following the same rules of function
		string.sub.

		Note that numerical codes are not necessarily portable across platforms.
		 * @param this 
		 * @param s 
		 * @param i 
		 * @param j 
		 */
		byte(this:void, s: string|number, i?: integer, j?: integer):integer
	}
	interface Utf8_static{
		offset	(this:void, str:string, n:integer, i?:integer):integer
		/** 包含無效ʹ字符旹 返nil */
		len	(this:void, s:string, i?:integer, j?:integer, lax?:boolean): integer|undefined
		char	(this:void, code:integer, ...ints:integer[]):string
		/**
		 * Returns the codepoints (as integers) from all characters in s that start
		between byte position i and j (both included). The default for i is
		1 and for j is i. It raises an error if it meets any invalid byte
		sequence.
		 * @param this 
		 * @param str 
		 * @param i 
		 * @param j 
		 * @param lax 
		 */
		codepoint	(this:void, str:string, i?:integer, j?:integer, lax?:boolean):integer
	}

	var len:LuaLength<any,integer> // non exist actually
	interface Debug{
		//traceback(thread: thread, message?: any, level?: integer):string
		traceback(this:void, message?: any, level?: integer):string
		getinfo(this:void, ...args:any[])
	}

	interface Os{
		time(this:void):integer
		date(this:void, format?:string)
		getenv(this:void, varname:string):string
		execute(this:void, command:string):integer
	}

	interface Package{
		path:string
		cpath:string
		loadlib(this:void, libname: string, funcname: string|'*'):(...args:any[])=>any

	}

	interface File{
		close(this)
		/**
		 * 
		 * @param this 
		 * @param format 
		 * *line 讀一行蕪換行符
		 * *all 读取整个文件内容，返回文件中所有剩余的字符。
		 * n 读取指定数量的字符，n 是一个正整数。
		 */
		read(this, format:str)
		write(this, content:string)
		lines(this, format?:string):LuaIterable<string>
		flush(this)
	}

	interface Io{
		open(this:void, fileName:string, mode:Lua.ioOpenMode):Lua.File|undefined
	}
}

declare var debug:Lua.Debug
declare var os:Lua.Os
declare var io:Lua.Io
declare var _G
declare var _VERSION
declare var table:Lua.Table_static
declare var string:Lua.LuaString_static
declare var utf8:Lua.Utf8_static
declare function assert(this:void)
declare function require(this:void, path:string):any
declare function type(this:void, v:any):Lua.luaType
declare function print(this:void, v:any):any
declare function error(this:void, message:any, level?:integer)
declare function pairs(this:void)
declare function ipairs(this:void)
declare function tonumber(this:void, e:string|number, base?:integer):number|nil
declare function tostring(this:void, v:any):string
declare function load(this:void, v:string): Function
declare function dofile(this:void)
declare function loadfile(this:void)
declare function setmetatable<T>(this:void, table:T, metatable:Lua.table):T
declare function getmetatable(this:void, table):LuaTable|undefined
declare function rawget<T>(this:void, key:string):any
declare function rawset(this:void, key:string, value:any):any
declare function select(this:void)
declare function pairs(this:void, v)
declare function ipairs(this:void, v)
/**
 * @customName package
 */
declare var package_:Lua.Package


interface Object{
	__index
	__newindex
}