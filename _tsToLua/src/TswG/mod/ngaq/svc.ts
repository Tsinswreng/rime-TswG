import * as File from '@/File'

const ngaqDir = rime_api.get_user_data_dir()+'/voca'
// class Opt{
// 	io={
// 		signal: vocaDir+'/signal'
// 		,in: vocaDir+'/in'
// 		,out: vocaDir+'/out'
// 	}
// }

export class IoOpt{
	fileSignal:string = ngaqDir+'/signal'
	fileIn:string = ngaqDir+'/in'
	fileOut:string = ngaqDir+'/out'
}



export class RimeNgaq{
	static new(ioOpt:IoOpt, delimiter:string){
		const z = new this()
		z.__init__(ioOpt, delimiter)
		return z
	}

	protected __init__(...args:Parameters<typeof RimeNgaq.new>){
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

	execEtSignal(cmd:string, ...args:string[]){
		const z = this
		let toWrite = cmd
		for(let i = 0; i < args.length; i++){
			toWrite += z.delimiter+args[i]
		}
		File.write(z.ioOpt.fileIn, 'w', toWrite)
		z.sendSignal()
	}

	readOut(){
		const z = this
		const ans = File.readAllLines(z.ioOpt.fileOut)
		return ans
	}

}



export{}