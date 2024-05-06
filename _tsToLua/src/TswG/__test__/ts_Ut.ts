import { describe,it,expect } from '@/UnitTest'
import * as Ut from '@/ts_Ut'
const equal = Ut.equal

export function run(){



describe('deep compare', ()=>{
	const fn = Ut.equal
	it('1',()=>{
		const a = ['b','c', ['d','e']]
		const b = ['b','c', ['d','e']]
		const ans = fn(a,b)
		expect(ans).toBe(true)
	})
	it('2',()=>{
		const a = ['b','c', ['d','e']]
		const b = ['b','c', ['d','E']]
		const ans = fn(a,b)
		expect(ans).toBe(false)
	})
	it('3',()=>{
		const a = {
			name:'jack'
			,age:'18'
			,arr: [1,2,3,4]
		}
		const b = {
			name:'jack'
			,age:'18'
			,arr: [1,2,3,4]
		}
		const ans = fn(a,b)
		expect(ans).toBe(true)
	})
	it('4',()=>{
		const a = {
			name:'jack'
			,age:'18'
			,arr: [1,2,3,4]
		}
		const b = {
			name:'jack'
			,age:'18'
			,arr: [1,2,3,5]
		}
		const ans = fn(a,b)
		expect(ans).toBe(false)
	})
	it('5',()=>{
		const a = {}
		const b = {}
		const ans = fn(a,b)
		expect(ans).toBe(true)
	})
	it('6',()=>{
		const a = void 0
		const b = {}
		let ans = fn(a,b)
		expect(ans).toBe(false)
		ans = fn(b,a)
		expect(ans).toBe(false)
	})
})


describe('deep merge', ()=>{
	it('1', ()=>{
		let o1 = {
			name:'o1'
			,age: 8
			,arr: [1,2,3]
		}
		let o2 = {
			age: 18
			,arr:[4,5]
		}
		let o0 = {}
		let ans = Ut.toDeepMerge(o0, o1, o2)
		Wat(o0['name'])
		Wat(o0['age'])
		for(const e of o0['arr']){
			Wat(e)
		}
		//Wat(ans)
	})
})



}
