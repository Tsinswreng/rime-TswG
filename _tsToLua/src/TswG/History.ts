/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

import { CyclicArray } from "./CyclicArray";


export class History<T> extends CyclicArray<T>{
	protected constructor(){
		super()
	}
	
	static new<T>(...prop:Parameters<typeof CyclicArray.new>):History<T>
	static new<T>(...prop:any[]):never

	static new<T>(...prop:Parameters<typeof CyclicArray.new>):History<T>{
		// const p = CyclicArray.new(...prop)
		// const c = new this<T>()
		// setPrototypeOf(p,c)
		
		//setPrototypeOf(c,p)
		const p = new this()
		p.__init__(...prop)
		return p as History<T>
	}

	protected override __init__(capacity:number){
		super.__init__(capacity)
	}

	addBackF(ele:T){
		const z = this
		if(z.isFull()){
			z.removeFront()
		}
		z.addBack(ele)
	}
	_cBcAbc=''
}



// class Te<T> extends History<T>{


// 	static new<T>(...args:any[]):never
// 	static new<T>(...args:Parameters<typeof History.new>):Te<T>
	
// 	static new<T>(...args:Parameters<typeof History.new>):Te<T>{
// 		const o = new this<T>()
// 		return o
// 	}
// }

// let a = Te.new<string>(1,'')