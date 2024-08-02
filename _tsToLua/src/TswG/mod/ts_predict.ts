/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

/* 
需要prd作僞方案
*/

//竹外桃花三兩枝春江水暖鴨先知

//FIXME:

/* 
褈置動態聯想詞庫後不復現
custom_code	text 
麗三 	麗三	c=3 d=0 t=270786
麗三千	麗三千	c=3 d=1.00003 t=72377
麗三千 	麗三千	c=3 d=0 t=270786
麗三千人	麗三千人	c=4 d=1.00003 t=72381
麗三千人 	麗三千人	c=4 d=0 t=270786

胡 custom_code 有兩況: 末有空格 與 末無空格者?

*/


import * as Module from '@/module'
import { History } from '@/History'
import * as algo from '@/ts_algo'
import { SchemaOpt } from '@/SchemaOpt'
import { nn, nna } from '@/ts_Ut'
import * as Str from '@/strUt'
import { LevelDbPool } from '@/LevelDbPool'
import { Cnt__Time_Ldb } from '@/KVDb'
const ldbPool = LevelDbPool.getInst()

// class Count__Time{
// 	count=0
// 	time=os.time()
// }



class PathNames{
	static new(){
		const o = new this()
		return o
	}
	readonly charToPush = 'charToPush'
	readonly switchName = 'switchName'
	readonly showComment = 'showComment'
	readonly showQuality = 'showQuality'
	readonly reverseName = 'reverseName'
	readonly predictCandTag_static = 'predictCandTag_static'
	readonly predictCandTag_dynamic = 'predictCandTag_dynamic '
	readonly defaultPredict = 'defaultPredict'
	readonly commitHistoryDepth = 'commitHistoryDepth'
	readonly splitterOfpredictWord__quality = 'splitterOfpredictWord__quality'
	readonly reverseDbPath = 'reverseDbPath'
}

class ModOpt{
	static new(){
		const o = new this()
		return o
	}
	charToPush = '^' //-- 須在speller中 
	switchName = 'predict' //--此模塊的開關ˋ在schema中之名 須添加在switches中
	activeSwitchName = 'active_predict'
	passiveSwitchName = 'passive_predict'
	showComment = true //-- 爲true旹 聯想候選無註釋
	showQuality = true // 在comment中 示權重
	//reverseName = 'TswG-predict' //dyMem 之名
	reverseDbName = 'prd' //靜態聯想詞ʹ名 及 動態聯想詞ʹ僞方案ʹ名
	predictCandTag_static = 'staticPredict'
	predictCandTag_dynamic = 'dynamicPredict'
	commentMark = {
		static : '*'
		,dynamic: ''
		//,default: ''
	}
	//竹外桃花三兩枝春江水暖鴨先知
	defaultPredict = ['的','了','嗎','是','不'] //---$默認添加到最後的聯想詞、㕥防搜索不到候選或候選過少
	commitHistoryDepth = 4 //--- $輸入歷史ˉ雙端隊列之最大容量
	splitterOfpredictWord__quality = '_' //--- $dict.yaml中聯想詞與默認權重之分隔符
	reverseDbPath = 'build_/'+this.reverseDbName+'.reverse.bin' //靜態聯想詞
	//metaDelimiter = '\u{7f}' //custom_code 中 錄末次ʹ改ʹ時間  刪除字符

	/** 另數據庫、錄每次ʹ錄入次數 及 末次改ʹ時間 */
	userPredictRecordDbName = 'userPredictRecord.ldb'
	userPredictRecordDbPath = rime_api.get_user_data_dir()+'/'+this.userPredictRecordDbName
	clearOnSpace=false
	/** 2024-07-07T21:51:24.924+08:00 */
	exludedPatterns= [
		``
	]
	excludedChars = ` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`
	noAscii=true
}
// 竹外桃花三兩枝春江水暖鴨先知
// 竹外桃花三兩枝春江水暖鴨先知// 留連戲蝶時時舞自在嬌鶯恰恰啼
// let m = {o:{b:'b'}}
// let neoO = {c:'c'}
// let b = m.o
// m.o = neoO
// b===neoO
class Mod extends Module.ModuleStuff{
	static new(){
		const o = new this()
		return o
	}

	protected _opt=ModOpt.new()
	get opt(){return this._opt}

	protected _env:Env

	static readonly pathNames = PathNames.new()
	get pathNames(){return Mod.pathNames}

	/** would be cleared */
	protected _mortalHistory:History<string>
	get mortalHistory(){return this._mortalHistory}

	/** never be cleared, only used to record 用于0鍵刪詞 */
	protected _immortalHistory:History<string>
	get immortalHistory(){return this._immortalHistory}

	protected _reverseDb:ReverseDb
	get reverseDb(){return this._reverseDb}

	/** text與custom_code須同 */
	protected _dyMem:Memory
	get dyMem(){return this._dyMem}

	protected _userPredictCntTimeDb:LevelDb
	get userPredictCntTimeDb(){return this._userPredictCntTimeDb}

	protected _userCntTimeSvc:Cnt__Time_Ldb
	get userCntTimeSvc(){return this._userCntTimeSvc}

	protected _schemaOpt:SchemaOpt
	get schemaOpt(){return this._schemaOpt}

	/** 不知道int用來存甚麼、但是就是不想用set */
	protected _excludedChars = new Map<str, int>()
	get excludedChars(){return this._excludedChars}
	protected set excludedChars(v){this._excludedChars = v}
	


	//一 一去 二三 里 -> [["里"],["二三","里"],["一去","二三","里"],["一","一去","二三","里"]]
	protected _c_bc_abc2d:string[][] = []
	get c_bc_abc2d(){return this._c_bc_abc2d}
	set c_bc_abc2d(v){this._c_bc_abc2d = v}

	protected _c_bc_abc1d:string[] = []
	get c_bc_abc1d(){return this._c_bc_abc1d}
	set c_bc_abc1d(v){this._c_bc_abc1d = v}

	protected _staticPredictCands : Candidate[] = []
	get staticPredictCands(){return this._staticPredictCands}
	set staticPredictCands(v){this._staticPredictCands = v}

	protected _dynamicPredictCands : Candidate[] = []
	get dynamicPredictCands(){return this._dynamicPredictCands}
	set dynamicPredictCands(v){this._dynamicPredictCands = v}

	protected _allPredictCands:Candidate[] = []
	get allPredictCands(){return this._allPredictCands}
	set allPredictCands(v){this._allPredictCands = v}



	// protected _static_text__Cands = new Map<string, Candidate>()

	// protected _dynamic_text_Cands = new Map<string, Candidate>()

	protected _all_text__Cand = new Map<string, Candidate>()
	get all_text__Cand(){return this._all_text__Cand}
	set all_text__Cand(v){this._all_text__Cand = v}


	_init(env:Env){
		const z = this
		z._init_opt(env)
		const opt = z.opt
		z._mortalHistory = History.new(opt.commitHistoryDepth)
		z._immortalHistory = History.new(opt.commitHistoryDepth)
		z._reverseDb = ReverseDb(opt.reverseDbPath)
		z._schemaOpt = SchemaOpt.new(env)
		z.initNotifier(env.engine.context)
		z.init_dyMem(env.engine)
		z._initUserCntTimeDb()
		PredictSwitch.new().register(cmdMod)
		ActivePredictSwitch.new().register(cmdMod)
		PassivePredictSwitch.new().register(cmdMod)
		z._init_excludedChars()
	}

	protected _init_excludedChars(){
		const z = this
		const sp = Str.split(z.opt.excludedChars, '')
		sp.map(e=>z.excludedChars.set(e, e.charCodeAt(0)))
	}

	init_dyMem(engine:Engine){
		const z = this
		const schema = Schema(z.opt.reverseDbName)
		z._dyMem = Memory(engine, schema)
	}

	_init_opt(env:Env){
		const z = this
		const MS = Module.ModuleStuff
		const sep = MS.sep
		//const opt = z._opt
		const config = env.engine.schema.config
		const rootPath = MS.rootName
		const modPath = rootPath+sep+z.name
		const item = config.get_item(modPath)
		if(item == void 0){
			log.error(`cannot get configItem at\n${modPath}`)
			return
		}
		z._opt = SchemaOpt.deep.assignOnlyExistingKeys(z._opt, item)

		
		const defaultPredictPath = modPath+sep+z.pathNames.defaultPredict
		const defaultPredictItem = config.get_item(defaultPredictPath)
		const list = defaultPredictItem?.get_list()
		if(list != void 0){
			z._opt.defaultPredict = SchemaOpt.ut.parseSingleTypeScalarList(list, 'string')
		}
		return z.opt
	}

	_initUserCntTimeDb(){
		const z = this
		const db = ldbPool.connectByName(z.opt.userPredictRecordDbName, z.opt.userPredictRecordDbPath)
		z._userPredictCntTimeDb = db
		z._userCntTimeSvc = Cnt__Time_Ldb.new(db)
	}


	readonly This = Mod
	//static readonly _name = 'ts_predict'
	protected readonly _name = 'ts_predict'
	get name(){return this._name}


	protected _commitConne: Connection
	protected _selectConne: Connection

	timeTo = {
		pushInput : false
		,predict : false
		,remove_charToPush : false
	}

	
	// isOn(ctx:Context){
	// 	const z = this
	// 	return ctx.get_option(z._opt.switchName)
	// }

	/**
	 * clear mortalHistory
	 */
	clearHistory(){
		const z = this
		z.mortalHistory.clear()
	}

	addText__cand(text__cand:Map<string, Candidate>, cands:Candidate[]){
		for(const cand of cands){
			text__cand.set(cand.text, cand)
		}
		return text__cand
	}

	isOn_active(ctx:Context){
		const z = this
		return ctx.get_option(z._opt.activeSwitchName)
	}

	isOn_passive(ctx:Context){
		const z = this
		return ctx.get_option(z._opt.passiveSwitchName)
	}

	getRealInput(input:string, charToPush:string){
		return algo.removePrefix(input, charToPush)
	}

	pushRealInput(ctx:Context, charToPush:string){
		const z = this
		if( ctx.input == charToPush){
			return
		}else{
			const realInput = z.getRealInput(ctx.input, charToPush)
			if(realInput == void 0){
				return
			}
			//ctx.delete_input() //不效。 當用 pop input
			ctx.pop_input(
				Str.utf8Len(z._opt.charToPush)+1
			)
			ctx.push_input(realInput)
			return realInput
		}
	}

	/**
	 * @param dyMem 聯想詞userdict
	 * @param str 
	 */
	protected _updateDyMemByStr(this:void, dyMem:Memory, str:string){
		const de = DictEntry()
		de.text = str
		de.custom_code = str
		return dyMem.update_userdict(de, 1, '')
	}


	updateDyDbByStr(str:str){
		const z = this
		z._updateDyMemByStr(z.dyMem, str)
		z.userCntTimeSvc.update(str)
		return true
	}


	dyMemDelete(this:void, dyMem:Memory, str:string){
		dyMem.user_lookup(str, true) //-- 傳入false則尋不見、傳入true則多尋
		for(const de of dyMem.iter_user()){
			//--de.custom_code = '' 叵改此。否則update旹不效。
			dyMem.update_userdict(de, -1, '')
			log.info('deleted: '+str)
		}
		return true
	}

	geneStaticPredictCands(segment:Segment):Candidate[]{
		const z = this
		return z._geneStaticPredictCands(segment, z._c_bc_abc1d)
	}

	_geneStaticPredictCands(segment:Segment, c_bc_abc:string[]){
		const z = this
		const ans = [] as Candidate[]
		for(let i = 0; i < c_bc_abc.length; i++){
			const inputStr = c_bc_abc[i]
			const predictStrs = mod.reverseDb.lookup(inputStr)
			const predictStrArr = Str.split(predictStrs, ' ')
			for(let j = 0; j < predictStrArr.length; j++){
				const onePredict = predictStrArr[j]
				if( onePredict === '' ){
					continue
				}
				const predictWord__quality = 
					Str.split(onePredict, mod.opt.splitterOfpredictWord__quality)
				const predictWord = nn(predictWord__quality[0])
				const qualityStr_ori = predictWord__quality[1]??'0'
				const quality_ori = tonumber(qualityStr_ori)??0
				const quality = Math.log(
					1000**(i+1)
					+ quality_ori
				)

				let comment = ''
				if(mod.opt.showComment){
					comment += mod.opt.commentMark.static
					comment += ''+inputStr
					if(mod.opt.showQuality){
						comment += ' ' + quality
					}
				}
				
				/* 
				local comment = i..'-'..j..'-'..inputStr..'-'..quality..'-'..qualityStr_ori
				if config.predict.noComment then
					comment = ''
				end
				*/

				const cand = Candidate(
					mod.opt.predictCandTag_static
					, segment.start
					,segment._end
					,predictWord
					,comment
				)
				cand.quality = quality
				ans.push(cand)
			} // for j
		} // for i
		z._staticPredictCands = ans
		return ans
	}


	geneDynamicPredictCands(segStart, segEnd){
		const z = this
		// const c_bc_abc2d = algo.abc_to_c_bc_abc(hisToArr)
		// const c_bc_abc1d = c_bc_abc2d.map(e=>Str.join(e,''))
		const c_bc_abc1d = z.c_bc_abc1d
		return z._geneDynamicPredictCands(c_bc_abc1d, segStart, segEnd)
	}


	_geneDynamicPredictCands(c_bc_abc:string[], segStart:integer, segEnd:integer):Candidate[]{
		const z = this

		const cands = [] as Candidate[]
		for(let i = c_bc_abc.length-1; i>=0; i--){
			const inputStr = nna(c_bc_abc[i])
			z.dyMem.user_lookup(inputStr, true)
			for(const de of z.dyMem.iter_user()){
				const dt = de.text
				const sub = Str.removePrefixUnsafe(dt, inputStr)
				if(sub == void 0 || sub == ''){
					continue
				}
				de.text = sub
				const cand = Candidate('dyMem', segStart, segEnd, de.text, '')
				cand.quality = Math.log(
					(100*de.commit_count) ** ((inputStr).length)
					/ de.text.length
				) +de.weight
				// if( z.opt.noComment ){

				// }else{
				// 	cand.comment = '*'+inputStr+'-'+cand.quality
				// }

				if(mod.opt.showComment){
					cand.comment += mod.opt.commentMark.dynamic
					cand.comment += ''+inputStr
					if(mod.opt.showQuality){
						cand.comment += ' ' + cand.quality
					}
				}

				cands.push(cand)
			}
		}

		z._dynamicPredictCands = cands
		return cands
	}

	on_commitFn(this:void, _ctx:Context, self:Mod){
		const z = self
		return (ctx:Context=_ctx)=>{
			//取上屏詞
			const sele = ctx.get_selected_candidate()
			let commit:string
			if(sele != void 0){
				const gen = sele.get_genuine()
				commit = gen.text
			}else{
				commit = ctx.get_commit_text()
			}
			
			//錄史
			z.mortalHistory.addBackF(commit)
			z.immortalHistory.addBackF(commit)
			//TODO 未完

			if( algo.strContainsAnyInSet(commit, z.excludedChars) ){
				z.clearHistory()
			}

			//更新c_bc_abc 並錄入用戶動態詞庫
			const hisToArr = mod.mortalHistory.toArray()
			const c_bc_abc2d = algo.abc_to_c_bc_abc(hisToArr)
			const c_bc_abc1d = c_bc_abc2d.map(e=>Str.join_deprecated(e,''))
			z.c_bc_abc2d = c_bc_abc2d
			z.c_bc_abc1d = z.expandFirstEleOfCBcAbc(c_bc_abc1d)
			for(let i = 0; i < z.c_bc_abc1d.length; i++){
				const u = z.c_bc_abc1d[i]
				if(Str.utf8Len(u)===1){

				}else{
					//z.updateDyMemByStr_deprecated(z.dyMem, u)
					//z.updateDyDbByStr(u+' ') 此則聯想不效
					z.updateDyDbByStr(u)
				}
			}
			// if( z.isTimeToClearHistory() ){
				
			// }
			

			if( z.isOn_active(ctx) || z.isOn_passive(ctx)){
				z.geneDynamicPredictCands(0,0)
				z.geneStaticPredictCands(Segment(0,0))
				z._allPredictCands = []
				z._allPredictCands.push(...z.dynamicPredictCands, ...z.staticPredictCands)
				z._allPredictCands = algo.distinct(z._allPredictCands, (e)=>e.text)
				z._all_text__Cand = new Map()
				z.addText__cand(z._all_text__Cand, z._allPredictCands)
			}else{
			}
		}
	}

	

	on_selectFn(this:void, _ctx:Context, self:Mod){
		const z = self
		return (ctx:Context=_ctx)=>{
			const input = ctx.input
			if(z.isOn_active(ctx) && (input == void 0 || input == '') ){ //似此時 input必潙''
				z.timeTo.predict = true //當在push input之前

				const seg = Segment(0,0)
				ctx.push_input(z.opt.charToPush)
				// log.error(`Wat(ctx.composition.empty())`)
				// Wat(ctx.composition.empty()) // false
				
			}
		}
	}


	initNotifier(ctx:Context){
		const z = this
		z._commitConne = ctx.commit_notifier.connect(z.on_commitFn(ctx, z))
		z._selectConne = ctx.select_notifier.connect(z.on_selectFn(ctx,z))
		//z._selectConne = ctx.select_notifier.connect(z.onsele2)
	}

	isTimeToClearHistory():boolean{
		throw new Error('未叶')
	}

	/**
	 * 
	 * @param c_bc_abc ['不覺曉','眠不覺曉','春眠不覺曉']
	 * @returns ['曉','覺曉','不覺曉','眠不覺曉','春眠不覺曉']
	 */
	expandFirstEleOfCBcAbc(c_bc_abc:string[]){
		//['不覺曉','眠不覺曉','春眠不覺曉']
		const first = c_bc_abc[0] // "不覺曉"
		if( Str.utf8Len(first) === 1){
			return c_bc_abc
		}
		const firstCharArr = Str.split(first, '') // ["不", "覺", "曉"]
		const neo2d = algo.abc_to_c_bc_abc(firstCharArr) // [['曉'],['覺',曉'],['不','覺','曉']]
		neo2d.pop() // [['曉'],['覺','曉']]
		const neo1d = neo2d.map(e=>e.join('')) // ['曉', '覺曉']
		neo1d.push(...c_bc_abc) //['曉','覺曉','不覺曉','眠不覺曉','春眠不覺曉']
		return neo1d
	}



	fixGotQuality(q:number){
		let ans = Math.log(q)/1
		if(ans < 0){
			ans = 0
		}
		return ans
	}

	/**
	 * test
	 */
	printRecordDb(){
		const z = this
		const dba = z.userPredictCntTimeDb.query('')
		const sb = [] as str[]
		for(const [k,v] of dba.iter()){
			const ua = (k+'\t'+v)
			sb.push(ua)
		}
		log.info('<print>')
		log.info(sb.join('\n'))
		log.info('</print>')
	}

}


export const mod = Mod.new()


import { SwitchMaker, cmdMod } from './cmd/ts_cmd'

const predictMod = mod
class PredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['P', 'p']
	_switchNames_on = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}


class ActivePredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Ap', 'ap']
	_switchNames_on = [predictMod.opt.activeSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}

class PassivePredictSwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Pp', 'pp']
	_switchNames_on = [predictMod.opt.passiveSwitchName]
	//_switchNames_off = [predictMod.opt.activeSwitchName, predictMod.opt.passiveSwitchName]
}



class Processor extends Module.RimeProcessor{
	static new(){
		const o = new this()
		return o
	}

	override init(this: void, env: Env): void {
		mod._init(env)
		//Wat(mod.opt)//t
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {

		const ctx = env.engine.context
		const repr = key.repr()
		const keyCode = key.keycode
		const pr = Module.ProcessResult

		// if(repr === 'grave'){
		// 	mod.printRecordDb()
		// }
		// if(repr === 'grave'){
		// 	const dba = mod.userPredictCntTimeDb.query('')
		// 	Wat(dba)
		// 	for(const [k,v] of dba.iter()){
		// 		log.error(k+v)
		// 		Wat(Str.split(v, '\t'))
		// 	}
		// }
		 
		// if(!mod.isOn(ctx)){
		// 	return pr.kNoop  
		// }

 
		// if(repr === 'grave'){ //test
		// 	const mem = Memory(env.engine, env.engine.schema)
		// 	const habeo = mem.user_lookup('ja', true)
		// 	Wat(habeo)
		// 	for(const de of mem.iter_user()){
		// 		Wat([de.text, de.custom_code])
		// 		log.error('.')
		// 		Wat(mem.decode(de.code))
		// 	} 
		// 	// const habeo = mem.dict_lookup('', true, 64)
		// 	// Wat(habeo)
		// 	// for(const de of mem.iter_dict()){
		// 	// 	log.error(de.text)
		// 	// 	Wat(mem.decode(de.code))
		// 	// }
		// }
		
/* 		mod.dyMem.user_lookup('', true)
		for(const de of mod.dyMem.iter_user()){
			Wat([de.text, de.custom_code])
		} */

		if(!mod.isOn_active(ctx)){
			return pr.kNoop
		}
		
		const pushResult = mod.pushRealInput(ctx, mod.opt.charToPush) //--- 須置于 if has_menu之前
		//無菜單旹按退格則清史
		if( !ctx.has_menu() ){
			if( repr === 'BackSpace' ){
				mod.mortalHistory.clear()
				return Module.ProcessResult.kNoop
			}
			return pr.kNoop
		}

		//when has predict menu
		if( ctx.input === mod.opt.charToPush ){
			const gotKey = mod.schemaOpt.speller.keyCode__alphabet.get(keyCode)
			
			//若當前ʃ按ᵗ鍵ˋ 在alphabet中
			if( gotKey != void 0 ){

			}else if( repr === 'space' ){ //space 32 //repr === 'space'
				if(mod.opt.clearOnSpace){
					ctx.clear()
					return pr.kAccepted
				}
			}else if( 49 <= keyCode && keyCode <= 57 ){ //除0外 橫排數字
				return pr.kNoop
			}else if( repr === 'BackSpace' ){ //清ᵣ輸入史
				mod.mortalHistory.clear()
				return pr.kNoop
			}

			// return and tab key behave as usual
			else if( repr === 'Return' || repr === 'Tab' ){
				ctx.clear()
				return pr.kNoop
			}
			// 0鍵刪詞
			else if( repr === 'Release+0' ){ //其實是Release+0洏非'0'
				const text:string|undefined = ctx.get_selected_candidate()?.get_genuine()?.text
				const back = mod.immortalHistory.back
				const word = back + (text??'')
				mod.dyMemDelete(mod.dyMem, word)
				mod.mortalHistory.clear()
				return pr.kAccepted
			}

			//上下方嚮鍵不使菜單 消
			else if( repr === 'Up' || repr === 'Release+Up' || repr === 'Down' || repr === 'Release+Down' ){
			}
			//餘ᵗ鍵ˋ皆使菜單 消
			else{

				//ctx.clear()
				return pr.kNoop
			}
		}//if( ctx.input === mod.opt.charToPush )
		return pr.kNoop
	}
}

class Segmentor extends Module.RimeSegmentor{
	static new(){
		const o = new this()
		return o
	}

	override func(this: void, segmentation: Segmentation, env: Env): boolean {
		
		//log.error(`Wat(segmentation.back().tags)`)
		//Wat(segmentation.back()?.tags)
		// const ctx = env.engine.context
		// if(!mod.isOn_active(ctx)){
		// 	return true
		// }
		
		// Wat(segmentation.empty())
		// segmentation.empty()
		// if(ctx.input === mod.opt.charToPush){
		// 	const seg = Segment(0,1)
		// 	seg.prompt = ''
		// 	segmentation.add_segment(seg)
		// }
		return true
	}

	
}


class Translator extends Module.RimeTranslator{
	static new(){
		const o = new this()
		return o
	}

	override init(this: void, env: Env): void {
		
	}

	override func(this: void, input: string, segment: Segment, env: Env): void {
		if( !mod.timeTo.predict ){
			return
		}
		mod.timeTo.predict = false
		const ctx = env.engine.context
		let cands = [] as Candidate[]
		if(true){
			//const userCands = mod.geneUserPredictCands(env, segment, )
		}

		// const dynamicCands = mod.geneDynamicPredictCands(segment.start, segment._end)
		// mod.dynamicPredictCands = dynamicCands
		// const staticCands = mod.geneStaticPredictCands(segment)
		// mod.staticPredictCands = staticCands
		//const userCands = [testCand]
		const dynamicCands = mod.dynamicPredictCands
		const staticCands = mod.staticPredictCands
		cands.push(...dynamicCands, ...staticCands)
		cands.sort((b,a)=>{
			return a.quality - b.quality
		})

		cands = algo.distinct(cands, (e)=>e.text)

		for(let i = 0; i < cands.length; i++){
			const ucand = cands[i]
			ucand._start = segment.start
			ucand._end = segment._end
			yield_(ucand)
		}

		for(let i = 0; i < mod.opt.defaultPredict.length; i++){
			const defaCandStr = mod.opt.defaultPredict[i]
			const cand = Candidate(
				mod.opt.predictCandTag_static
				,segment.start
				,segment._end
				,defaCandStr
				,''
			)
			yield_(cand)
		}
	}

}



class Filter extends Module.RimeFilter{

	static new(){
		const o = new this()
		return o
	}

	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		const cands = [] as Candidate[]
		for(const cand of translation.iter()){
			cands.push(cand)
		}

		/** 會受limitFilter影響。 */
		if( mod.isOn_passive(ctx) && ctx.input.length <= 1 ){ //TODO
			for(let i = 0; i < cands.length; i++){
				if(i === 0){
					cands[i].quality +=1 //使首個候選ʹ權重ˋ更大、方便打首字母出常用字
				}
				const cand = cands[i]
				const got = mod.all_text__Cand.get(cand.text)
				if(got == void 0){continue}
				// cand.quality += got.quality/2
				//Wat(cand.text+' '+cand.quality+' '+got.quality)//t
				//cand.quality += Math.log(got.quality)/10
				let fixQuality = mod.fixGotQuality(got.quality)
				cand.quality += fixQuality
				
			}
			cands.sort((b,a)=>{return a.quality - b.quality})
		}

		
		for(const cand of cands){
			yield_(cand)
		}
	}
}

const processor = Processor.new()
const segmentor = Segmentor.new()
const translator = Translator.new()
const filter = Filter.new()

export {processor, segmentor, translator, filter}




