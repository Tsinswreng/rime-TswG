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
 * 用leveldb錄某key之頻次與末次修改ʹ時間
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

	// /** 一個幽靈，一個共產主義的幽靈，在歐洲遊蕩。爲了對這個幽靈進行神聖的圍剿
	//  * @deprecated
	//  */
	// geneValueStr_deprecated(oldCnt:number, increment:num){
	// 	const z = this
	// 	let sb = [] as str[]
	// 	const neoCnt = oldCnt+increment
	// 	sb.push(neoCnt+'')
	// 	sb.push(z.delimiter)
	// 	const neoTime = z.getTime()
	// 	sb.push(neoTime+'')
	// 	return sb.join('')
	// }


	// /**
	//  * @deprecated
	//  */
	// parseValue_deprecated(valStr:str):[int, str]{
	// 	const z = this
	// 	const splt = Str.split(valStr, z._delimiter)
	// 	const cntStr = splt[0]??'0'
	// 	const timeStr = splt[1]??''
	// 	const cnt = tonumber(cntStr)??0
	// 	return [cnt, timeStr]
	// }

	// update_deprecated(key:str, increment:num=1){
	// 	const z = this
	// 	const db = z.ldb
	// 	const got = db.fetch(key)
	// 	if(got == void 0){ //初添
	// 		return db.update(key, z.geneValueStr_deprecated(0, increment))
	// 	}else{
	// 		const [cnt, toki] = z.parseValue_deprecated(got)
	// 		const neoVal = z.geneValueStr_deprecated(cnt, increment)
	// 		return db.update(key, neoVal)
	// 	}
	// 	return false
	// }

	/**
	 * //TODO
	 */
	// merge(other:Cnt__Time_Ldb){
	// 	const hisDba = other.ldb.query('')
	// 	for(const [k,v] of hisDba.iter()){
	// 		const [hisCnt, hisToki] = other.parseValue_deprecated(v)
	// 	}
	// } 天接雲濤連曉霧星河欲轉千帆舞仿佛夢魂歸帝所聞天語殷勤問我歸何處我報路長嗟日暮學詩漫有驚人句九萬里風鵬正舉風休住蓬舟吹取三山去
}
