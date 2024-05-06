import { describe,it,expect } from '@/UnitTest'
import { History } from '@/History'
import { equal } from '@/ts_Ut'
import { CyclicArray } from '@/CyclicArray'
export function run(){


describe('extends CyclicArray', ()=>{
	const o = History.new(3)
	it('capacity', ()=>{
		Wat(o)
		Wat(o['_capacity'])
		Wat(o['capacity'])
		expect(o.capacity).toBe(3)
	})

	it('parnet method', ()=>{
		expect(o.addBack != void 0).toBe(true)
	})
	it('child method', ()=>{
		expect(o.addBackF != void 0).toBe(true)
	})
	it('instanceof', ()=>{
		expect(o instanceof CyclicArray).toBe(true)
	})
})

describe('addBackF',()=>{
	it('err1',()=>{
		try {
			const o = History.new(0)
		} catch (error) {
			expect(error instanceof Error).toBe(true)
		}
	})

	it('err2',()=>{
		try {
			const o = History.new(1.2)
		} catch (error) {
			expect(error instanceof Error).toBe(true)
		}
	})

	it('3', ()=>{
		const o = History.new(3)
		o.addBack('a')
		o.addBack('b')
		o.addBack('c')
		let arr = o.toArray()
		equal(arr, ['a','b','c'])

		o.addBackF('d')
		arr = o.toArray()
		equal(arr, ['b','c','d'])

	})
	

})


}