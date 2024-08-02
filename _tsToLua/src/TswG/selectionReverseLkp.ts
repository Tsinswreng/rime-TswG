import * as Str from '@/strUt'
import * as algo from '@/ts_algo'

export class SelectionMaker{
	protected constructor(){}
	static new(reverseLookup:ReverseLookup){
		const z = new this()
		z.__init__(reverseLookup)
		return z
	}

	protected __init__(...args:Parameters<typeof SelectionMaker.new>){
		const z = this
		z._reverseLookup = args[0]
		return z
	}

	// protected _delimiterInPreedit:str
	// get delimiterInPreedit(){return this._delimiterInPreedit}


	protected _reverseLookup:ReverseLookup
	get reverseLookup(){return this._reverseLookup}

	/**
	 * 
	 * @param text '車馬'
	 * @param dividedScript ['che', 'ma']
	 * @returns 
	 */
	geneSelection(text:str, dividedScript:str[]){
		const z = this
		const sel = Selection.new({
			_text:text
			,_dividedScript:dividedScript
		})

		sel.fullSyllables2d = z.seekReverse2dCodesOfChars(sel.chars) // ['車', '馬'] -> [['che', 'ju'], ['ma']]
		sel.filteredSyllables = z.prefixFilterOrAsIs_2d(sel.fullSyllables2d, sel.dividedScript)
		return sel
	}

	/**
	 * 車 -> ['che', 'ju']
	 * @param char 整個ˇ傳入reverseLookup.lookup
	 * @returns 
	 */
	seekReverseCodes(char:str){
		const z = this
		const got = z.reverseLookup.lookup(char)
		return Str.split(got, ' ')
	}

	/**
	 * ['車', '馬'] -> [['che', 'ju'], ['ma']]
	 */
	seekReverse2dCodesOfChars(charArr:str[]){
		const z = this
		//const charArr = Str.split(charArr, '')
		return charArr.map(e=>z.seekReverseCodes(e))
	}


	/**
	 * 若過濾ʹ果ˋ潙空旹 返原ʹ入ʹ數組
	 * @param strArr ['che', 'ju'] (車)
	 * @param prefix 'c'
	 * @returns ['che']
	 */
	prefixFilterOrAsIs(strArr:str[], prefix:str){
		const got = strArr.filter(e=>Str.isPrefix(e, prefix))
		if(got.length === 0){
			return strArr
		}
		return got
	}

	/**
	 * 
	 * @param strArr2d [['che', 'ju'], ['ma']]
	 * @param prefixs ['che', 'm']
	 * @returns [['che'], ['ma']]
	 */
	prefixFilterOrAsIs_2d(strArr2d:str[][], prefixs:str[]){
		const z = this
		const ans = [] as str[][]
		for(let i = 0; i < strArr2d.length; i++){
			const strArr = strArr2d[i] // ['che', 'ju']
			const uprfx = prefixs[i]??''
			const ua = z.prefixFilterOrAsIs(strArr, uprfx)
			ans.push(ua)
		}
		return ans
	}

	/**
	 * 諸selections之text: ['車碼', '炮']
	 * -> ['che ma pao', 'ju ma pao']
	 * @param selections 
	 */
	static linearizeFilteredSyllables(selections: Selection[]){
		//const ans = [] as str[]
		//const d3 = [] as str[][][] //   [  [['che', 'ju'], ['ma']] , [['pao']] ]
		const syllable2d = [] as str[][] //[['che','ju'], ['ma'], ['pao']]
		selections.map(e=>{
			const d2 = e.filteredSyllables //[['che', 'ju'], ['ma']] 不考慮過濾成功之況
			syllable2d.push(...d2)
		})

		const car = algo.cartesianProduct(syllable2d) // [['che', 'ma', 'pao'], ['ju', 'ma', 'pao']]
		const d1 = car.map(e=>e.join(' ')) // ['che ma pao', 'ju ma pao']
		return d1
	}


	/**
	 * @see linearizeFilteredSyllables
	 * @param selections 
	 * @returns 
	 */
	static toText__linearized(selections:Selection[]):[str, str[]]{
		const textArr = selections.map(e=>e.text)
		const text = textArr.join('')
		const linearized = SelectionMaker.linearizeFilteredSyllables(selections)
		return [text, linearized]
	}

}

export class Selection{
	protected constructor(){}

	protected __init__(...args:Parameters<typeof Selection.new>){
		const z = this
		const prop = args[0]
		z._text = prop._text
		//z._scriptText = prop._scriptText
		//z._delimiterInPreedit = prop._delimiterInPreedit
		z._dividedScript = prop._dividedScript
		z._initProp()
		return z
	}

	static new(prop:{
		_text:str
		//_scriptText:str
		_dividedScript:str[]
		//_delimiterInPreedit:str
	}){
		const z = new this()
		z.__init__(prop)
		return z
	}

	/** 
	 * 車馬
	 * constructorIn
	 */
	protected _text:str = ''
	get text(){return this._text}

	/** ['車','馬'] */
	protected _chars:str[] = []
	get chars(){return this._chars}

	/** 
	 * che|m
	 * constructorIn
	 */
	// protected _scriptText:str = ''
	// get scriptText(){return this._scriptText}

	/**
	 * constructorIn
	 */
	// protected _delimiterInPreedit:str = '|'
	// get delimiterInPreedit(){return this._delimiterInPreedit}


	/** 
	 * 非ˌ分隔芝完整ʹ音節
	 * 設preedit後之分隔符潙|、當輸入 chem旹、潙che|m
	 * 則此字段潙['che', 'm']
	 */
	protected _dividedScript:str[] = []
	get dividedScript(){return this._dividedScript}

	/** 
	 * //TODO 先試 reverseLookup能不能查整詞 不能
	 * 車馬->[
	 * 	['che', 'ju'],
	 * 	['ma']
	 * ]
	 */
	protected _fullSyllables2d:str[][] = []
	get fullSyllables2d(){return this._fullSyllables2d}
	set fullSyllables2d(v){this._fullSyllables2d = v}

	/** 
	 * 車馬 -> [['che'], ['ma']] //過濾成功
	 * 過濾失敗則同 @see this._fullSyllables2d
	 */
	protected _filteredSyllables:str[][] = []
	get filteredSyllables(){return this._filteredSyllables}
	set filteredSyllables(v){this._filteredSyllables = v}

	protected _initProp(){
		const z = this
		z._chars = Str.split(z._text, '')
		//z._dividedScript = Str.split(z._scriptText, z.delimiterInPreedit)
	}
}
