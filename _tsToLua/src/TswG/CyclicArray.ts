/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

/**
 * 2024-08-03T16:17:11.205+08:00
 */
export default class CyclicArray<T>{
	protected constructor(){
		
	}


	
	static new<T>(capacity:number):CyclicArray<T>
	static new(...args:any[]):never
	
	static new<T>(capacity:number){
		const o = new this<T>()
		o.__init__(capacity)
		return o
	}

	protected __init__(capacity:number){
		const o = this
		if(capacity <= 0){
			throw new RangeError(`${capacity}\ncapacity <= 0`)
		}
		if(!Number.isInteger(capacity)){
			throw new RangeError(`${capacity}\ncapacity is not an integer`)
		}
		o._capacity = capacity
	}

	protected _data = [] as T[]
	get data(){return this._data}
	
	/** 實際元素量 */
	protected _size:number = 0
	get size(){return this._size}

	/** 內部數組ᵗ容量 */
	protected _capacity:number = 0
	get capacity(){return this._capacity}
	// set capacity(v){
	// 	this.expand(v)
	// }

	//protected _reversed = false
	/** 非空旹 頭元素之位 */
	protected _frontI = 0
	/** 非空旹 尾元素之位 */
	protected _backI = 0
	

	get front(){return this._data[this._frontI]}
	get back(){return this._data[this._backI]}


	static fromArrayRef<T>(arr:T[], capacity:number=arr.length){
		if(capacity!= void 0 && capacity < arr.length){
			throw new RangeError(`capacity < ${arr.length}`)
		}
		const o = new this<T>()
		o._capacity = capacity
		o._data = arr
		o._size = arr.length
		o._frontI = 0
		o._backI = arr.length -1
		return o
	}

	static fromArrayCopy<T>(arr:T[], capacity:number=arr.length){
		const o = CyclicArray.fromArrayRef(arr, capacity)
		o._data = arr.slice()
		return o
	}
	

	isEmpty(){
		return this.size === 0
	}

	isFull(){
		return this._size === this._capacity
	}

	clear(){
		this._data = []
		this._size = 0
		this._frontI = 0
		this._backI = 0
	}


	//<,2024-03-27T18:40:02.000+08:00>取消O(1) reverse
	// reverse(){
	// 	// const temp = this._frontI
	// 	// this._frontI = this._backI
	// 	// this._backI = temp
	// 	const s = this
	// 	let t

		
	// 	t = this.frontIterFn.bind(this)
	// 	this.frontIterFn = this.backIterFn.bind(this)
	// 	this.backIterFn = t

	// 	t = this.addFront.bind(this)
	// 	this.addFront = this.addBack.bind(this)
	// 	this.addBack = t

	// 	t = this.removeFront.bind(this)
	// 	this.removeFront = this.removeBack.bind(this)
	// 	this.removeBack = t
	// 	this._reversed = !this._reversed

	// 	t = s.frontGet.bind(s)
	// 	s.frontGet = s.backGet.bind(s)
	// 	s.backGet = t

	// 	t = s.frontSet.bind(s)
	// 	s.frontSet = s.backSet.bind(s)
	// 	s.backSet = t
	// }

	addBack(ele:T){
		if(this.isFull()){
			return false
		}
		if(this.isEmpty()){
			this._data[this._backI] = ele
		}else{
			//this._backI = (this._backI+1)%this.capacity
			this._backI = CyclicArray.posAdd(this._backI, this._capacity, 1)
			this._data[this._backI] = ele
		}
		this._size += 1
		return true
	}

	removeBack(){
		if(this.isEmpty()){
			return void 0
		}
		const t = this.back
		//delete this._data[this._backI]
		//@ts-ignore
		this._data[this._backI] = void 0
		this._size -= 1
		CyclicArray.posSub(this._backI, this._capacity, 1)
		// this._backI = this._backI-1
		// if(this._backI < 0){this._backI+=this._capacity}
		return t
	}

	addFront(ele:T){
		if(this.isFull()){
			return false
		}
		if(this.isEmpty()){
			
		}else{
			// this._frontI = this._frontI-1
			// if(this._frontI < 0){this._frontI+=this._capacity}
			this._frontI = CyclicArray.posSub(this._frontI, this._capacity, 1)
		}
		this._data[this._frontI] = ele
		this._size += 1
		return true
	}

	/**
	 * 強添于尾、若滿則擠出頭元素
	 * @param ele 
	 * @returns 被擠出之元素
	 * //TODO test
	 */
	addBackF(ele:T){
		const z = this
		if(z.addBack(ele)){ //成功
			return
		}
		const front = z.removeFront()
		z.addBack(ele)
		return front
	}

	/**
	 * 強添于頭、若滿則擠出尾元素
	 * @param ele 
	 * @returns 被擠出之元素
	 * //TODO test
	 */
	addFrontF(ele:T){
		const z = this
		if(z.addFront(ele)){ //成功
			return
		}
		const back = z.removeBack()
		z.addFront(ele)
		return back
	}

	/**
	 * 
	 * @param index [0, capacity-1]
	 * @param capacity when capacity is 5, index is in [0,4]
	 * @param num 正整數
	 * @returns 
	 */
	static posAdd(index:number, capacity:number, num:number){
		index = (index+num) % capacity
		return index
	}

	/**
	 * 
	 * @param index [0, capacity-1]
	 * @param capacity when capacity is 5, index is in [0,4]
	 * @param num 正整數
	 */
	static posSub(index:number, capacity:number, num:number){
		num = num % capacity
		index -= num
		if(index < 0){
			index += capacity
		}
		return index
	}

	/**
	 * 從頭到尾 取num位之元素
	 * @param num 從0始
	 * @returns 
	 */
	frontGet(num:number){
		let index = CyclicArray.posAdd(this._frontI, this.capacity, num)
		return this._data[index]
	}

	/**
	 * @see this.frontGet
	 * @param num 
	 * @param item 
	 * @returns 
	 */
	frontSet(num:number, item:T){
		let index = CyclicArray.posAdd(this._frontI, this.capacity, num)
		this._data[index] = item
		return index
	}

	/**
	 * 從尾到頭取num位之元素
	 * @param num 從0始
	 * @returns 
	 */
	backGet(num:number){
		let index = CyclicArray.posSub(this._backI, this.capacity, num)
		return this._data[index]
	}

	/**
	 * @see backGet
	 * @param num 
	 * @param item 
	 * @returns 
	 */
	backSet(num:number, item:T){
		let index = CyclicArray.posSub(this._backI, this.capacity, num)
		this._data[index] = item
		return index
	}

	removeFront(){
		if(this.isEmpty()){
			return void 0
		}
		const t = this.front

		//delete this._data[this._frontI]
		//@ts-ignore
		this._data[this._frontI] = void 0
		//this._frontI = (this._frontI+1)%this.capacity
		this._frontI = CyclicArray.posAdd(this._frontI, this._capacity, 1)
		this._size -= 1
		return t
	}

	/* expand(neoCapacity:number){
		const s = this
		if (neoCapacity <= this.size){
			//return false
			throw new RangeError(`new capacity <= ${this.size}`)
		}
		const neoData = s.toArray()
		//delete s._data
		//@ts-ignore
		s._data = neoData
		s._capacity = neoCapacity
		s._frontI = 0
		if(s.size === 0){
			s._backI = 0
		}else{
			s._backI = s.size-1
		}
		return true
	} */

	expand(neoCapacity:number){
		const z = this
		return z.capacityAdd(neoCapacity-z.capacity)
	}

	/**
	 * 擴容。只移ʃ需移。
	 */
	capacityAdd(add:number){
		const z = this
		if(z._frontI > z._backI){
			const frontIToDataEnd = [] as T[]
			for(let i = z._frontI; i < z.data.length; i++){
				frontIToDataEnd.push(z._data[i])
				//@ts-ignore
				//delete z.data[i] //如是則得empty item 洏非undefined
				//@ts-ignore
				z.data[i] = void 0
			}

			z._frontI += add
			const oriDataLen = z.data.length
			for(let i = z._frontI, j = 0; i < oriDataLen+add; i++, j++){
				z._data[i] = frontIToDataEnd[j]
			}
		}
		z._capacity += add
	}

	static toExpand<T>(old:CyclicArray<T>, neoCapacity:number){
		if (neoCapacity <= old.size){
			//return false
			throw new RangeError(`new capacity <= ${old.size}`)
		}
		const arr = old.toArray()
		const neo = CyclicArray.fromArrayRef(arr, neoCapacity)
		return neo
	}

	/**
	 * usage:
	 * const fi = deque.frontIterFn()
	 * for(let i = 0; i < deque.size; i++){
	 * 	console.log(fi())
	 * }
	 */
	frontIterFn(){
		//let i = this._frontI
		let i = 0
		//let cnt = 0
		return (cnt=1)=>{
			// const t = this._data[i]
			// i = (i+1)%this.capacity
			// //cnt++
			// return t
			const ans = this.frontGet(i+cnt-1)
			i = CyclicArray.posAdd(i, this.capacity, cnt)
			return ans
		}
	}

	backIterFn(){
		//let i = this._backI
		let i = 0
		//let cnt = 0
		return (cnt=1)=>{
			// const t = this._data[i]
			// i = (i-1)
			// if(i<0){i+=this.capacity}
			// //cnt++
			// return t
			const ans = this.backGet(i+cnt-1)
			i = CyclicArray.posAdd(i, this.capacity, cnt)
			return ans
		}
	}

	/**
	 * 從頭到尾、所有元素轉數組。返ᵗ數組ᵗlength同size洏非capacity
	 * @returns 
	 */
	toArray(){
		const s = this
		const next = s.frontIterFn()
		const ans = [] as T[]
		for(let i = 0; i < s.size; i++){
			ans[i] = next()
		}
		return ans
	}

}



// protected frontIterClass(){
		
// 	class DequeFrontIter<T> implements I_Iter<T>{
// 		protected _deque:Deque<T> = undefined as unknown as Deque<T>
// 		protected constructor(/* _deque:Deque<T> */){
// 			//this._deque = _deque
// 		}
// 		static new<T>(deque:Deque<T>, start:number){
// 			const o = new this<T>()
// 			o._pos = start
// 			return o
// 		}

// 		protected _cnt = 0
// 		protected _pos = undefined as unknown as number

// 		current(): T {
// 			return this._deque._data[this._pos]
// 		}
// 		next(): T {
// 			const data = this.current()
// 			this._pos = (this._pos+1)%this._deque._capacity
// 			this._cnt += 1
// 			return data
// 		}
// 		hasNext(): boolean {
// 			if(this._cnt === this._deque._size){
// 				return false
// 			}
// 			return true
// 		}
// 		rewind() {
// 			throw new Error("Method not implemented.")
// 		}
// 		count(): number {
// 			return this._cnt
// 		}

		
// 	}

// }

interface I_Iter<T>{
	current():T
	next():T
	hasNext():boolean
	rewind()
	count():number
}



// let a:number|undefined = 0
// let b:string|null = ''
// function aa(){
// 	let c = a??b
// }
