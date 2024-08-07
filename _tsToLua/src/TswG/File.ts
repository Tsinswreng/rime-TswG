/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import { IOErr } from "./IOErr"

export class File{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof File.new>){
		const z = this
		z._luaFile = args[0]
		return z
	}

	static new(file:Lua.File){
		const z = new this()
		z.__init__(file)
		return z
	}

	static open(...args:Parameters<typeof io.open>){
		try {
			const luaFile = io.open(...args)
			if(luaFile == void 0){
				throw IOErr.new(`fileName=\n${args[0]}\nmode=\n${args[0]}\nfile open failed`)
			}
			const file = File.new(luaFile)
			return file
		} catch (error) {
			const ioe = IOErr.new()
			ioe._err = error
			throw ioe
		}
	}

	get This(){return File}

	protected _luaFile:Lua.File
	get luaFile(){return this._luaFile}
	protected set luaFile(v){this._luaFile = v}
	
	nextLine(){
		try {
			const z = this
			return z.luaFile.read('*line')
		} catch (error) {
			const ioe = IOErr.new()
			ioe._err = error
			throw ioe
		}
	}

	close(){
		try {
			return this.luaFile.close()
		} catch (error) {
			const ioe = IOErr.new()
			ioe._err = error
			throw ioe
		}
	}

	write(content:str){
		const z = this
		z.luaFile.write(content)
	}

	flush(){
		return this.flush()
	}
}






export function readAllLines(fileName:string){
	const file = io.open(fileName, 'r')
	if(file == void 0){
		throw new Error(`file == void 0\n${fileName}\n`)
	}
	const ans = [] as string[]
	for(const line of file.lines()){
		ans.push(line)
	}
	file.close()
	return ans
}

export function write(fileName:string, mode:Lua.ioOpenMode, content:string){
	const file = io.open(fileName, mode)
	if(file == void 0){
		throw new Error(`file == void 0\n${fileName}\n`)
	}
	const ans = file.write(content)
	file.close()
	return ans
}


export function appendWrite(fileName:string, content:string){
	const file = io.open(fileName, 'a')
	if(file == void 0){
		throw new Error(`file == void 0\n${fileName}\n`)
	}
	file.write(content)
	file.close()
}


