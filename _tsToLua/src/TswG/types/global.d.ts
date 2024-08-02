/* 
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

declare function Wat(this:void, v:any):string
// declare namespace global{
// 	export function Wat(this:void, v:any):void
// }

type kvobj<k extends string|number|symbol=string, v=any> = Record<k, v>
type jstype = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
declare type int = number
declare type num = number
declare type str = string
declare type bool = boolean
declare type undef = undefined
