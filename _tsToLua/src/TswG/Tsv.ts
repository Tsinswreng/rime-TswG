import { Line } from "./Line"
import { I_readN } from "./Type"

export class Status{
	end = false
	linePos = -1
}

export class Tsv{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tsv.new>){
		const z = this
		z._reader = args[0]
		return z
	}

	static new(reader:I_readN<Promise<str[]>>){
		const z = new this()
		z.__init__(reader)
		return z
	}

	get This(){return Tsv}

	protected _reader:I_readN<Promise<str[]>>
	get reader(){return this._reader}
	protected set reader(v){this._reader = v}

	/** 當前処理ʹ行號 */
	//protected _linePos = -1
	get linePos(){return this.status.linePos}
	protected set linePos(v){this.status.linePos = v}

	protected _status = new Status()
	get status(){return this._status}
	protected set status(v){this._status = v}
	

	async readLines(num:int){
		const z = this
		const lines = await z.reader.read(num)
		if(lines == void 0 || lines.length === 0){
			z.status.end = true
			return []
		}
		const ans:Line[] = []
		for(const lineTxt of lines){
			if(lineTxt == void 0){continue}
			const ua = z.handleLine(lineTxt)
			ans.push(ua)
		}
		return ans
	}

	protected handleLine(lineTxt:str):Line{
		const z = this
		z.linePos++
		const ans = Line.new(lineTxt, z.linePos)
		return ans
	}
	
}