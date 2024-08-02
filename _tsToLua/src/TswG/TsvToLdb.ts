//import * as Str from '@/strUt'
import * as algo from '@/ts_algo'
import { Line } from './Line'
import { I_readN } from './Type'
import { Tsv } from './Tsv'
type KvArr = [str, str][]
type ReaderRet = Promise<str[]>
class TsvLine extends Line{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof TsvLine.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args:Parameters<typeof Line.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	protected _key:str
	get key(){return this._key}
	protected set key(v){this._key = v}

	protected _value:str
	get value(){return this._value}
	protected set value(v){this._value = v}

	protected _kvSeparator:str = '\t'
	get kvSeparator(){return this._kvSeparator}
	set kvSeparator(v){this._kvSeparator = v}
	
	get This(){return TsvLine}

	getKV(){
		const z = this
		const kv = algo.splitByFirstSeparatorChar(
			z.rawText
			,z.kvSeparator
		)
		return kv
	}
}



export class TsvToLdb extends Tsv{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof TsvToLdb.new>){
		const z = this
		z._reader = args[0]
		return z
	}

	static new(reader:I_readN<ReaderRet>){
		const z = new this()
		z.__init__(reader)
		return z
	}

	get This(){return TsvToLdb}

	declare protected _reader:I_readN<ReaderRet>
	get reader(){return this._reader}
	set reader(v){this._reader = v}
	

	async readLines(num:int){
		const z = this
		const lines = await z.reader.read(num)
		if(lines == void 0 || lines.length === 0){
			z.status.end = true
			return []
		}
		const ans:TsvLine[] = []
		for(const lineTxt of lines){
			if(lineTxt == void 0){continue}
			const ua = z.handleLine(lineTxt)
			ans.push(ua)
		}
		return ans
	}

	protected handleLine(lineTxt:str){
		const z = this
		z.linePos++
		const ans = TsvLine.new(lineTxt, z.linePos)
		return ans
	}

	async addInLdb(ldb:LevelDb){
		const z = this
		const bat = 9999
		for(;!z.status.end;){
			const lines = await z.readLines(bat)
			for(const line of lines){
				const [k,v] = line.getKV()
				ldb.update(k,v)
			}
		}
		return true
	}

	
	// mk(){
	// 	const z = this
	// 	const tsvPath = z.tsvPath
	// 	const file = io.open(tsvPath, 'r')
	// 	if(file == void 0){
	// 		throw new Error(`tsvPath=\n${tsvPath}\nconst file = io.open(tsvPath, 'r') failed`)
	// 	}
	// 	file.lines()
	// }
	
}



