import * as Str from '@/strUt'



export class EntryK{

}

export class EntryV{
	protected constructor(){}
	protected __init__(){}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	get This(){
		return EntryV
	}

	parse(str:str):EntryV{
		return EntryV.new()
	}

	toStringfy():str{
		return ''
	}
}


/**
 * 頻次	末次修改ʹ時	創ʹ時
 */
export class CntTimeV extends EntryV{
	protected constructor(){
		super()
	}

	protected __init__(...args:Parameters<typeof CntTimeV.new>){
		super.__init__(...args)
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	get This(){return CntTimeV}

	protected _cnt:int=0
	get cnt(){return this._cnt}
	set cnt(v){this._cnt = v}

	protected _createdDate:str = os.time()+''
	get createdDate(){return this._createdDate}

	protected _modifiedDate:str = os.time()+''
	get modifiedDate(){return this._modifiedDate}
	set modifiedDate(v){this._modifiedDate = v}

	protected _delimiter = '\t'
	get delimiter(){return this._delimiter}
	set delimiter(v){this._delimiter = v}

	static get delimiter(){return '\t'}

	override toStringfy(): string {
		const z = this
		const sb = [] as string[]
		sb.push(z.cnt+'')
		sb.push(z.delimiter)
		
		sb.push(z.modifiedDate+'')
		sb.push(z.delimiter)

		sb.push(z.createdDate+'')
		let ans = sb.join('')
		return ans
	}

	override parse(str:str){
		const z = this
		const [_cnt, _modifiedDate, _createdDate] = Str.split(str, z.delimiter)
		const cnt:int = tonumber(_cnt)??0
		const modifiedDate = _modifiedDate??''
		const createdDate = _createdDate??''
		const ans = CntTimeV.new()
		ans._createdDate = createdDate
		ans._modifiedDate = modifiedDate
		ans._cnt = cnt
		return ans
	}

}


/**
 * 用leveldb錄某key之頻次與末次修改ʹ時間 與 創ʹ時
 */
export class Cnt__Time_Ldb{

	protected constructor(){}

	protected __init__(ldb:LevelDb, delimiter?:str){
		const z = this
		z._ldb = ldb
		if(delimiter != void 0){
			z._delimiter = delimiter
		}
		z._valueHelp.delimiter = z._delimiter
		return z
	}

	static new(ldb:LevelDb, delimiter?:str){
		const z = new this()
		z.__init__(ldb, delimiter)
		return z
	}

	protected _ldb:LevelDb
	get ldb(){return this._ldb}

	protected _valueHelp = CntTimeV.new()
	
	protected _delimiter = '\t'
	get delimiter(){return this._delimiter}

	getTime():str{
		return os.time()+''
	}

	parseV(valueStr:str){
		const z = this
		z._valueHelp.delimiter = z.delimiter
		const ans = z._valueHelp.parse(valueStr)
		return ans
	}


	stringfyV(valueObj:CntTimeV){
		return valueObj.toStringfy()
	}

	/**
	 * 原地改
	 */
	updateV(oldV:CntTimeV, increment:num=1){
		const neo = oldV
		neo.cnt+=increment
		neo.modifiedDate = os.time()+''
		return neo
	}

	update(key:str, increment:num=1):bool{
		const z = this
		const db = z.ldb
		const got = db.fetch(key)
		if(got == void 0){ //init add
			const neov = CntTimeV.new()
			neov.cnt = 1
			const vStr = neov.toStringfy()
			return db.update(key, vStr)
		}else{
			const oldV = z.parseV(got)
			const neoV = z.updateV(oldV, 1)
			const neoStr = neoV.toStringfy()
			return db.update(key, neoStr)
		}
	}
}
