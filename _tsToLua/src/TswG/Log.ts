/**
 * @see 'librime.d.ts' declare var log:Log
 * log.warning('123') // ok
 * log['warning']('123') // ok
 * const lv = 'warning'; log[lv]('123') // error:
 * LuaProcessor::ProcessKeyEvent of fixedTeengqPeeng_P error(2): bad argument #2 to '?' (string expected, got table)
 */


class Log{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Log.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Log}
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

export const tlog = Log.new()
