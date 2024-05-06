import { UnitTest } from "@/UnitTest";
const unitTest = UnitTest.new()

const describe = unitTest.describe.bind(unitTest)
const it = unitTest.it.bind(unitTest)
const ass = (a,b:any=true)=>{
	if(a===b){
	}else{
		throw new Error(`${a} !== ${b}`)
	}
}

describe('1',()=>{
	it('1',()=>{
		ass(1+2,3)
	})
	it('2',()=>{
		ass('as'==='as')
	})
})

describe('2',()=>{
	it('2',()=>{
		ass('ASS'==='ASS')
	})
})

export {unitTest}