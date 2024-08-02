import * as Module from '@/module'
import * as rimeUt from '@/ts_rimeUtil'
import { History } from '@/History'
import * as Str from '@/strUt'
import { Selection, SelectionMaker } from '@/selectionReverseLkp'
import { SchemaOpt } from '@/SchemaOpt'
import * as algo from '@/ts_algo'

class Opt{
	historyDepth = 4
	/** input區中 實際顯示的音節分隔符、即被preedit処理過者 */
	delimiterInPreedit = '|' 
}

// class Char{
// 	protected constructor(){}
// 	protected __init__(){}
// 	static new(){}

// 	_text:str = ''

// }


class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'coinage'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = new Opt()
	get opt(){return this._opt}
	protected _env: Env;


	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._selectionHistory = History.new(z.opt.historyDepth)
		z._mem = Memory(env.engine, env.engine.schema)
		z._dictName = rimeUt.getDictName(env.engine.schema)
		z._rvsLkp = ReverseLookup(z._dictName)
		z._selectionMaker = SelectionMaker.new(z._rvsLkp)
		z._initCommitConne(env)
		z._initSelectConne(env)
		z._schemaOpt = SchemaOpt.new(env)
	}

	protected _schemaOpt:SchemaOpt
	get schemaOpt(){return this._schemaOpt}

	protected _mem:Memory
	get mem(){return this._mem}

	protected _dictName:str = ''
	get dictName(){return this._dictName}

	protected _rvsLkp:ReverseLookup
	get rvsLkp(){return this._rvsLkp}

	/**
	 * [
	 * 	['春眠', 'chun m'],
	 * 	['不', 'bu']
	 * 	['覺', 'jue']
	 * ]
	 */


	protected _selectionHistory:History<Selection>
	get selectionHistory(){return this._selectionHistory}

	protected _selectionMaker:SelectionMaker
	get selectionMaker(){return this._selectionMaker}

	protected _commitConne:Connection
	protected _initCommitConne(env:Env){
		const z = this
		const ctx = env.engine.context
		z._commitConne = ctx.commit_notifier.connect(z.on_commitFn())
	}

	protected _selectConne:Connection
	protected _initSelectConne(env:Env){
		const z = this
		const ctx = env.engine.context
		z._selectConne = ctx.select_notifier.connect(z.on_selectFn())
	}


	// get_word__customCodes(db, hist:History<[str, str]>){
	// 	const ans = []
	// 	const arrOfChar__code = hist.toArray()
	// 	const commits = arrOfChar__code.map(e=>e[0]) //['春眠', '不','覺']
	// 	const inputCodes = arrOfChar__code.map(e=>e[1]) //['chun m', 'bu', 'jue']
	// }

	/**
	 * 取 選中ʹ候選ʹ字
	 * 若直ᵈ上屏洏非選中旹 返""
	 */
	getSelectText(ctx:Context){
		const z = this
		let ans = ''
		const sele = ctx.get_selected_candidate()
		if(sele != void 0){
			const genu = sele.get_genuine()
			ans = genu.text
		}
		return ans
	}

	/**
	 * 你是‸甚麼 : ni|shi -> ["ni", "shi"]
	 * @param ctx 
	 */
	geneDividedScriptText(ctx:Context){
		const z = this
		const script = ctx.get_script_text()
		const ans = Str.split(script, z.opt.delimiterInPreedit)
		return ans
	}

	geneSelection(ctx:Context){
		const z = this
		const text = z.getSelectText(ctx)
		const divScr = z.geneDividedScriptText(ctx)
		const ans = z.selectionMaker.geneSelection(text, divScr)
		return ans
	}

	on_commitFn(){
		const z = this
		return function(this:void, ctx:Context){
			const selection = z.geneSelection(ctx)
			//z.selectionHistory.addBackF(selection)
			const ans = z.tryAddHistory(selection)
		}
	}

	on_selectFn(){
		const z = this
		return function(this:void, ctx:Context){
			const des = z.updateUserDb()
			// des.map(e=>{
			// 	//Wat(e.text) //t
			// })
		}
	}

	/**
	 * 
	 * @param selection 若其chars中有字串芝于reverseLookup中尋不見者、如匪漢字、則此selection不加入歷史 且清空歷史
	 * @returns 
	 */
	tryAddHistory(selection:Selection){
		const z = this
		// '車が好い' -> [['che1', 'ju1'], [''], ['hao3', 'hao4'], ['']]
		for(const syllables of selection.fullSyllables2d){
			//Wat(syllables)//t
			if(syllables.length === 0 || syllables[0]===''){
				z.selectionHistory.clear()
				//Wat('clear')
				return false
			}
		}
		z.selectionHistory.addBackF(selection)
		return true
	}

	isKeyToClearHistory(key:KeyEvent, ctx:Context){
		const z = this
		const keyCode = key.keycode
		
		if( ctx.has_menu() ){
			return false
		}
		if(
			keyCode !== 0x20 //空格
			&& !(0x31<=keyCode && keyCode <= 0x39) // 橫排數字鍵 1~9
			&& !( z.schemaOpt.speller.keyCode__alphabet.has(keyCode) )
		){
			return true
		}
		return false
	}

	/** @deprecated */
	linearizeHistorySyllables(){
		const z = this
		const hist = z.selectionHistory
		const arr = hist.toArray()
		return SelectionMaker.linearizeFilteredSyllables(arr)
	}

	/**
	 * @deprecated
	 * 車馬炮 -> ['che ma pao', 'ju ma pao']
	 * @returns 
	 */
	geneText__codes_deprecated():[str, str[]]{
		const z = this
		const histArr = z.selectionHistory.toArray()
		const [text, codes] = SelectionMaker.toText__linearized(histArr)
		return [text, codes]
	}

	/**
	 * 車馬炮
	 * -> 炮, 馬炮, 車馬炮
	 * [
	 * ['炮', ['pao']],
	 * ['馬炮', ['ma pao']],
	 * ['車馬炮', ['che ma pao', 'ju ma pao']],
	 * ]
	 */
	gene_c_bc_abc_text__codes(){
		const z = this
		const hisArr = z.selectionHistory.toArray()
		const c_bc_abc = algo.abc_to_c_bc_abc(hisArr)
		const ans = [] as [str, str[]][]
		for(const selections of c_bc_abc){
			const text__codes = SelectionMaker.toText__linearized(selections)
			ans.push(text__codes)
		}
		return ans
	}

	geneEntries(){
		const z = this
		function one(text:str, codes:str[]){
			//const [text, codes] = z.geneText__codes_deprecated()
			const ans = [] as DictEntry[]
			for(let i = 0; i < codes.length; i++){
				const code = codes[i]??''
				const de = DictEntry()
				de.text = text
				de.custom_code = code+' '
				ans.push(de)
			}
			return ans
		}
		const c_bc_abc = z.gene_c_bc_abc_text__codes()
		const ans = [] as DictEntry[]
		for(const [text, codes] of c_bc_abc){
			const ua = one(text, codes)
			ans.push(...ua)
		}
		return ans
	}


	filterDictEntries(des:DictEntry[]){
		const ans = [] as DictEntry[]
		for(const de of des){
			if(Str.utf8Len(de.text) >= 2){
				ans.push(de)
			}
		}

		return ans
	}
  
	updateUserDb(){
		const z = this
		let des = z.geneEntries()
		des = z.filterDictEntries(des)
		for(const de of des){
			z.mem.update_userdict(de, 1, '')
			//Wat(de.text)//t 
		}
		return des
	}

	handleClearHistory(key:KeyEvent, ctx:Context){
		const z = this
		if(z.isKeyToClearHistory(key, ctx)){
			z.selectionHistory.clear()
			return true
		}
		return false
	}

	testLogHistory(){
		const arr = mod.selectionHistory.toArray()
		const t = '\t'
		log.error('___________________________')
		arr.map(e=>{
			Wat(e.text)
			Wat(e.chars)
			Wat(e.dividedScript)
			Wat(e.fullSyllables2d)
			Wat(e.filteredSyllables)
			log.info('~~~~')
		})
	}

	testLogLinealized(){
		log.error('__________')
		Wat(mod.selectionHistory.toArray().map(e=>e.text))
		Wat(mod.linearizeHistorySyllables())//t
	}

}
export const mod = new Mod()
const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		//mod.handleClearHistory(key, ctx)
		//mod.testLogHistory()
		return pr.kNoop
	}
}

export const processor = new Processor()


/* 

*/