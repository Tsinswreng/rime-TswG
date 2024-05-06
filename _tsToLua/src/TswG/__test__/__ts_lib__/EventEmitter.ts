import Emt from "@/_ts_lib/EventEmitter";
import { describe,it,expect } from '@/UnitTest'
export default function run(){

describe('eventEmitter', ()=>{
	it('1',()=>{
		let a = "a"
		const emt = Emt<any>()
		emt.on('a',(b:string)=>{
			a += b
		})
		emt.emit('a', 'b')
		Wat(a)
	})
})




	
}