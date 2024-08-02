import { libTswG } from '@/_lib/libTswG/libTswG'
import { winClipboard as winClipboardFn } from './_lib/winClipboard/winClipboard'

export function getMilliseconds():integer|undefined{
	if(libTswG){
		return libTswG()?.getMilliseconds()
	}
}


/** @deprecated */
export function getWinClipboard():string|undefined{
	if(winClipboardFn){
		return winClipboardFn()?.get()
	}
}


class Clipboard{

	protected constructor(){

	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected __init__(){
		const z = this
		if(os.getenv('OS') === 'Windows_NT'){
			z.__initWin__()
		}
		return z
	}

	protected __initWin__(){
		const z = this
		if(winClipboardFn != void 0){
			const obj = winClipboardFn()
			if(obj != void 0){
				if(typeof obj.get === 'function'){
					z.get = function(this:Clipboard){
						return obj.get()??''
					}
				}
				if(typeof obj.set === 'function'){
					z.set = function(this:Clipboard, str:string){
						return obj.set(str)??false
					}
				}
			}
		}
		return z
	}

	get(){
		return ''
	}
	
	set(str:string){
		return false
	}
}

export const clipboard = Clipboard.new()

