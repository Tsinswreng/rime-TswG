/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/


import { nn } from "./ts_Ut"

class Describe{
	protected constructor(){

	}
	static new(name:string, fn:Function){
		const o = new this()
		o.name = name
		o.fn = fn
		return o
	}
	name:string
	fn:Function
	run(){
		const z = this
		console.log(`${z.name}:`)
		return this.fn()
	}
}

class It{
	protected constructor(){

	}
	static new(name:string, fn:Function, timeout?:number){
		const o = new this()
		o.name = name
		o.fn = fn
		o.timeout = timeout
		return o
	}
	name:string
	fn:Function
	timeout:number|undefined
	run(){
		const z = this
		console.log(`  - ${z.name}`)
		try {
			const ans = this.fn()
			console.log(`    √`)
			return ans
		} catch (error) {
			console.error(`    X ${error}`)
		}
		
	}
}

/**
 * @deprecated
 */
export class UnitTest{
	protected constructor(){

	}
	static new(){
		const o = new this()
		return o
	}

	protected _describeArr:Describe[] = []
	get describeArr(){return this._describeArr}

	protected _itArr:It[] = []
	get itArr(){return this._itArr}

	protected _name__describe = new Map<string, Describe>()
	get name__describe(){return this._name__describe}

	protected _name__it = new Map<string, It>()
	get name__it(){return this._name__it}



	describe(name:string, fn:Function){
		const z = this
		const des = Describe.new(name, fn)
		z._describeArr.push(des)
		z._name__describe.set(name, des)
	}

	it(name:string, fn:Function, timeout?:number){
		const z = this
		const il = It.new(name, fn, timeout)
		z._itArr.push(il)
		z._name__it.set(name, il)
	}

	run(opt:{
		describe?:string
		it?:string
	}={}){
		const z = this
		const desStr = opt?.describe
		const itStr = opt?.it
		if(desStr == void 0 || itStr == void 0){
			for(const d of z._describeArr){
				d.run()
			}
			for(const it of z._itArr){
				it.run()
			}
		}else{
			const des = z._name__describe.get(desStr)
			const it = z._name__it.get(itStr)
			if( des == void 0){
				throw new Error(`${des}\nno such describe`)
			}
			if( it === void 0){
				throw new Error(`${it}\nno such it`)
			}
			des.run()
			it.run()
		}
	}
}

// 定义 describe 函数
export function describe(description: string, tests: () => void) {
	console.log(description);
	tests();
}

// 定义 it 函数
export function it(description: string, test: () => void) {
	console.log(`  - ${description}`);
	try {
		test();
		console.log("    √ Passed");
	} catch (error) {
		console.error(`    X Failed: ${error}`);
	}
}

// 定义 expect 函数
export function expect<T>(actual: T) {
	return {
		toBe(expected: T) {
			if (actual !== expected) {
				throw new Error(`${actual} is not equal to ${expected}`);
			}
		},
	};
}
