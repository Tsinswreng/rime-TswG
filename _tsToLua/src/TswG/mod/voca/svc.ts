import * as File from '@/File'
import * as RimeCmd from '@/mod/ts_cmd'

const vocaDir = rime_api.get_user_data_dir()+'/voca'
// class Opt{
// 	io={
// 		signal: vocaDir+'/signal'
// 		,in: vocaDir+'/in'
// 		,out: vocaDir+'/out'
// 	}
// }

export class IoOpt{
	fileSignal:string = vocaDir+'/signal'
	fileIn:string = vocaDir+'/in'
	fileOut:string = vocaDir+'/out'
}



export class RimeVoca{
	static new(ioOpt:IoOpt, delimiter:string){
		const z = new this()
		z.__init__(ioOpt, delimiter)
		return z
	}

	protected __init__(...args:Parameters<typeof RimeVoca.new>){
		const z = this
		z._ioOpt = args[0]
		z._delimiter = args[1]
		return z
	}

	protected _ioOpt:IoOpt
	get ioOpt(){return this._ioOpt}
	set ioOpt(v){this._ioOpt = v}

	protected _delimiter:string = ','
	get delimiter(){return this._delimiter}

	// protected _cmd = new VocaCmd()
	// get cmd(){return this._cmd}

	sendSignal(){
		const z = this
		File.appendWrite(z.ioOpt.fileSignal, os.time()+'')
	}

	exec(cmd:string, ...args:string[]){
		const z = this
		let toWrite = cmd
		for(let i = 0; i < args.length; i++){
			toWrite += z.delimiter+args[i]
		}
		File.write(z.ioOpt.fileIn, 'w', toWrite)
		z.sendSignal()
		const ans = File.readLines(z.ioOpt.fileOut)
		return ans
	}

}



export{}