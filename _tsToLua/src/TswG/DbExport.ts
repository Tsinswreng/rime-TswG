import { LevelDbPool } from "./LevelDbPool";
const pool = LevelDbPool.getInst()
import { ErrWrap } from "./ErrWrap";



// export function levelDbExport(dbName:string, dbPath:string, targetFile:string){
// 	const db = pool.connectByName(dbName, dbPath)
// 	const dba = db.query('')
// 	const f = io.open(targetFile, 'w')
// 	if(f == void 0){
// 		throw new Error(`f == void 0`)
// 	}
// 	for(const [k,v] of dba.iter()){
// 		f.write()
// 	}

// }

export class LevelDbExport{
	protected constructor(){}

	/**
	 * 
	 * @param prop 
	 * _targetFile 須用絕對路徑
	 * @returns 
	 */
	static new(prop:{
		_dbName:string
		_dbPath?:string
		_separator?:string
		_targetFile:string
		_formatFn?:(k:string, v:string)=>string
	}){
		//return new this().__init__(prop) /只寫此句則編譯報錯
		const z = new this()
		z.__init__(prop)
		return z
	}

	protected __init__(...args:Parameters<typeof LevelDbExport.new>){
		const z = this
		Object.assign(z, ...args)
		if(z._dbPath == void 0){
			z._dbPath = rime_api.get_user_data_dir()+'/'+this._dbName
		}
		return z
	}

	// protected __init__(){

	// }

	// static new(){

	// }

	protected _dbName:string
	get dbName(){return this._dbName}

	protected _dbPath:string// 
	get dbPath(){return this._dbPath}

	protected _targetFile:string
	get targetFile(){return this._targetFile}

	protected _separator:string = '\t'
	get separator(){return this._separator}
	set separator(v){this._separator = v}

	protected _formatFn = (k:string, v:string, i:int, ...args:any[])=>{return k+this._separator+v}
	get formatFn(){return this._formatFn.bind(this)}
	set formatFn(v){this._formatFn = v}

	run(){
		try {
			const z = this
			const f = io.open(z.targetFile, 'w')
			if(f == void 0){
				throw new Error(`f == void 0`)
			}
			const db = pool.connectByName(z.dbName, z.dbPath)
			const dba = db.query('')
			{
				let i = 0
				for(const [k,v] of dba.iter()){
					const fmt = z.formatFn(k,v,i)
					f.write(fmt)
					f.write('\n')
					i++
				}
			}
			f.close()
			db.close()
			return true
		} catch (error) {
			const err = new ErrWrap()
			err._err = error
			throw err
		}

	}
}
