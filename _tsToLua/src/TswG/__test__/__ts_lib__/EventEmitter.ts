import Emt from "@/__ts_lib__/EventEmitter";
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