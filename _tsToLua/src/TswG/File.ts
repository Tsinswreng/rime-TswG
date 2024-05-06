/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/


export function readLines(fileName:string){
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
