import * as Str from '@/strUt'
import * as algo from '@/ts_algo'
import { SchemaOpt } from '@/SchemaOpt'
import * as Cmd_ from '@/mod/cmd/ts_cmd'
import { nn, readFile } from '@/ts_Ut'
import * as clib from '@/_lib'
const SwitchMaker = Cmd_.SwitchMaker
const cmdMod = Cmd_.cmdMod
const Operation = Cmd_.Operation

class SimplificationSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['S', 's']
	_switchNames_on: string[] = [SchemaOpt.switchNames.simplification]
}
SimplificationSwitch.new().register(cmdMod)




class Help extends Operation{
	get cmdName(): string {
		return 'help'
	}
	run() {
		const z = this
		const keys = cmdMod.cmd__op.keys()
		log.error('_______________________________________')
		for(const k of keys){
			Wat(k)
		}
	}
}
cmdMod.addOp(new Help())

class TestYieldCand extends Operation{
	static i = 0
	get cmdName(): string {
		return 'ca'
	}
	run() {
		const z = this
		cmdMod.timeToYieldCand = true
		cmdMod.addCands([Candidate('a', 0,0, (TestYieldCand.i++)+'', 'TEST')])
		const ctx = z.env.engine.context
		ctx.push_input('^')
		//ctx.pop_input(1)
		//mod.yieldCands()
	}
}
cmdMod.addOp(new TestYieldCand())

class LoadString extends Operation{
	get cmdName(): string {
		return 'l'
	}
	run() {
		const z = this
		if(z.argStr == void 0){return}
		const fn = load(`return ${z.argStr}`)
		const ans = fn()
		z.env.engine.commit_text(ans)
	}
}
cmdMod.addOp(new LoadString())


//似一次性上屏字符串長度有個數限制
class UnicodeToChar extends Operation{
	get cmdName(): string {
		return 'u'
	}
	run() {
		const z = this
		if(z.argStr == void 0){return}
		
		const args = Str.split(z.argStr, cmdMod.opt.argSeparator)
		const hexStr = args[0]
		const cntStr = args[1]
		const cnt = tonumber(cntStr)??1
		const baseHex = tonumber(hexStr, 16)
		if(baseHex == void 0){return}
		const ans = z.multi(baseHex, cnt)
		
		z.env.engine.commit_text(ans)
	}

	toChar(code:integer){
		return utf8.char(code)
	}

	multi(base:integer, cnt:integer){
		const z = this
		const sb = [] as str[]
		for(let i = 0; i < cnt; i++){
			const ua = z.toChar(base+i)
			//ans+=ua
			sb.push(ua)
		}
		const ans = sb.join('')
		return ans
	}
}
cmdMod.addOp(new UnicodeToChar())

class Paste extends Operation{
	get cmdName(): string {
		return 'v'
	}

	run(){
		const z = this
		if(z.argStr == void 0 || z.argStr === ''){
			return z.runNoArg()
		}
		//paste with opencc convert
		if(z.args[0] === 'c'){
			return z.opencc()
		}

		if(z.args[0] === 'x'){
			try {
				return z.eval()
			} catch (error) {
				Wat(error)
				z.env.engine.commit_text(error+'')
			}
			
		}
	}

	/**
	 * $v,c,t2s
	 * @returns 
	 */
	opencc(){
		const z = this
		const argStr = nn(z.argStr)
		const args = Str.split(argStr, cmdMod.opt.argSeparator)
		const openccName = args[1]
		const openccPath = openccName+'.json'
		const opencc = Opencc(openccPath)
		const cb = clib.clipboard.get()
		if(cb == void 0 || cb === ''){
			return
		}
		const ans = opencc.convert(cb)
		return algo.groupHandleLongStr(ans, 128, z.env.engine.commit_text.bind(z.env.engine))
	}

	/**
	 * 直接上屏剪貼板
	 * @returns 
	 */
	runNoArg() {
		
		const z = this
		const cb = clib.clipboard.get()
		if(cb == void 0 || cb === ''){
			return
		}
		let ans = algo.escapeStrToCommit(cb)
		return algo.groupHandleLongStr(ans, 128, z.env.engine.commit_text.bind(z.env.engine)) // 縱是c庫中導出ʹ函數 亦需bind
	}

	/**
	 * 將剪貼板內容作爲命令執行
	 * 第一個參數潙x
	 * $v,x
	 * @returns 
	 */
	eval(){
		
		const z = this
		const cb = clib.clipboard.get()
		if(cb == void 0 || cb === ''){
			return
		}
		return cmdMod.eval(cb, z.env)
	}
}
cmdMod.addOp(new Paste())

class UnixMills extends Operation{
	get cmdName(): string {
		return 'unixt'
	}
	run() {
		const z = this
		// if(libTswG == void 0){
		// 	return
		// }
		// const mills = libTswG()?.getMilliseconds()
		const mills = clib.getMilliseconds()
		z.env.engine.commit_text(mills==void 0?'':mills+'')
	}
}
cmdMod.addOp(new UnixMills())

// class TestReadFile extends Operation{
// 	get cmdName(): string {
// 		return 'file'
// 	}
// 	run() {
// 		const z = this
// 		const text = readFile('D:/_code/voca/src/shared/WordWeight/Schemas/MyWeight.ts')
// 		Wat(text)
// 	}
// }
// cmdMod.addOp(new TestReadFile())

/** 反斜槓ˇ換潙正斜槓、上屏並寫入剪貼板 */
class Pth extends Operation{
	get cmdName(): string {
		return 'pth'
	}
	run() {
		const z  = this
		const cb = clib.clipboard.get()
		if(cb == void 0 || cb === ''){
			return
		}
		let ans = rime_api.regex_replace(cb, '\\\\', '/')
		let start = clib.getMilliseconds()
		clib.clipboard.set(ans)
		let end = clib.getMilliseconds()
		Wat(
			nn(start) - nn(end)
		)
		z.env.engine.commit_text(ans)
		z.env.engine.context.clear()
	}
}
cmdMod.addOp(new Pth())


import { LevelDbExport } from '@/DbExport'
import { ErrWrap } from '@/ErrWrap'

// $ldb,o|D:/Program Files/Rime/User_Data/_userdb/_commitHistory|./abc114.txt
// $ldb,o|D:/Program Files/Rime/User_Data/_userdb/20240522212923dks_userDict.userdb|./abc114.txt
// $ldb,o|D:/Program Files/Rime/User_Data/_userdb/commitHistory.ldb|./abc114.txt

class LdbExport extends Operation{
	get cmdName(){
		return 'ldb'
	}

	sep='|'

	resplitArgs(){
		const z = this
		//     o|/a/b/c.ldb|/a/b/d.txt
		z.args = Str.split(z.argStr??'', z.sep)
		
	}
//$ldb,o|"D:/Program Files/Rime/User_Data/_userdb/test/userPredictRecord.ldb"|./userPredictRecord.txt
//
	run(){
		try {
			const z = this
			z.resplitArgs()
			if(z.args[0] === 'o'){
				z.ldbExport()
			}
		} catch (err) {
			if(err instanceof ErrWrap){
				//Wat(err)
				Wat(err._err)
				log.error(err.stack??'')
			}
			throw err
		}

	}

	/**
	 * $ldb,o|/a/b/c.ldb|/a/b/d.txt
	 * 
	 */
	ldbExport(){
		const z = this
		const src = z.args[1]
		const dst = z.args[2]
		const ldbE = LevelDbExport.new({
			_dbName: src
			,_dbPath: src
			,_targetFile:dst
			,_separator:'\t'
		})
		// ldbE.formatFn = function(k,v,i){
		// 	log.error(i+'')
		// 	return '123'
		// }
		ldbE.run()
		
	}

}
cmdMod.addOp(new LdbExport())

export {cmdMod}