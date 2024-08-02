import { ErrWrap } from "./ErrWrap"

export class IOErr extends ErrWrap{
	protected constructor(){super()}
	protected __init__(...args:Parameters<typeof IOErr.new>){
		const z = this
		z.message = args[0]??''
		return z
	}

	static new(msg?:str){
		const z = new this()
		z.__init__(msg)
		return z
	}

	get This(){return IOErr}

}
