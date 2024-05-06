import { equal } from '@/ts_Ut'
import { describe,it,expect } from '@/UnitTest'

export function run(){

describe('utf8 split', ()=>{
	it('1',()=>{
		const str = '1一二23𠂇bcd我是你 @#	'
		const got = str.split('')
		console.log(got)
	})

})


}
