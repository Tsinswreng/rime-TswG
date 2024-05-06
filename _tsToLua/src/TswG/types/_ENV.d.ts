/* 
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

declare namespace _ENV{


interface Env{

}
// var env:Env


interface Candidate{
	type	:'user_phrase'|'phrase'|'punct'|'simplified'|'completion'
	start	:number
	_start	:number
	_end	:number
	quality	:number
	text	:string
	comment	:string
	preedit	:string
	get_dynamic_type	(this:Candidate):string
	get_genuine	(this:Candidate):Candidate
	get_genuines	(this:Candidate)
	to_shadow_candidate	(this:Candidate)
	to_uniquified_candidate	()
	append	()
}

interface ShadowCandidate extends Candidate{

}

interface Translation{
	iter(this:Translation):LuaIterable<Candidate>
}

interface Segment{

}



interface KeyEvent{
	repr(this:KeyEvent):string
}

interface Log{
	info	(this:void, v:string):void
	warning	(this:void, v:string):void
	error	(this:void, v:string):void
}


var log:Log

var Candidate: (
	this:void
	,type:string
	,_start:integer
	,_end:integer
	,text:string
	,comment:string
)=> Candidate

/** @customName yield */
function yield_(this:void, candidate:Candidate):void




//在我的嵌入式js環境中(不是瀏覽器環境也不是node環境) 有一個全局變量、既可以通過log訪問 也可以通過_ENV.log訪問。請問我該如何爲他寫.d.ts的類型聲明?




}