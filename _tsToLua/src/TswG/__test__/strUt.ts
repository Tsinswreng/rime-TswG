import { describe,it,expect } from '@/UnitTest'
import * as strUt from '@/strUt'
import { equal } from '@/ts_Ut'

export function run(){

	describe('lua_utf8Sub', ()=>{
		const fn = strUt.lua_utf8sub
		it('1',()=>{
			const str = '把♡大♡佬♡抱♡起♡來♡超♡😋♡𠂇♡a♡b♡c♡'
			//const str = '123'
			const ans = fn(str, 1, 2)
			//console.log(ans)
			expect(ans==='把♡').toBe(true)
		})
	})

	describe('split', ()=>{
		const fn = strUt.split
		it('1', ()=>{
			const str = '把♡大♡佬♡抱♡起♡來♡超♡😋♡𠂇♡a♡b♡c♡'
			const ans = fn(str, '♡')
			const b = equal(ans, ["把","大","佬","抱","起","來","超","😋","𠂇","a","b","c",""])
			expect(b).toBe(true)
			//console.log(ans)
		})
		it('2', ()=>{
			const str = '一二三𠂇abc'
			const ans = fn(str, '')
			const b = equal(ans, ['一','二','三','𠂇','a','b','c'])
			expect(b).toBe(true)
		})
	})
	


}

