import { File, write } from "./File"
import { AnsiColors } from "./AnsiColors"

/**
 * @see 'librime.d.ts' declare var log:Log
 * log.warning('123') // ok
 * log['warning']('123') // ok
 * const lv = 'warning'; log[lv]('123') // error:
 * LuaProcessor::ProcessKeyEvent of fixedTeengqPeeng_P error(2): bad argument #2 to '?' (string expected, got table)
 */


class RimeLog{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof RimeLog.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return RimeLog}
	info(v=''){
		log.info(v)
	}
	warning(v=''){
		log.warning(v)
	}
	error(v=''){
		log.error(v)
	}
}

export const rlog = RimeLog.new()

export class Log{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Log.new>){
		const z = this
		z.filePath = args[0]
		//z.file = File.new(z.filePath)
		return z
	}

	static new(filePath: string){
		const z = new this()
		z.__init__(filePath)
		return z
	}

	get This(){return Log}

	protected _filePath: string = rime_api.get_user_data_dir+'/Tswg_log'
	get filePath(){return this._filePath}
	protected set filePath(v){this._filePath = v}

	// protected _file:File
	// get file(){return this._file}
	// protected set file(v){this._file = v}

	a(txt:str){
		const z = this
		return write(z.filePath, 'a', txt)
	}

	aW(txt:str){
		const z = this
		return write(z.filePath, 'a', AnsiColors.White+txt)
	}

	w(txt:str){
		const z = this
		return write(z.filePath, 'w', txt)
	}
	
}

