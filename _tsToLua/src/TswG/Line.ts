export class Line{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof Line.new>){
		const z = this
		z.rawText = args[0]
		z.index = args[1]
		return z
	}
	static new(text:str, index:int){
		const z = new this()
		z.__init__(text, index)
		return z
	}
	rawText:str
	index:int

	/**
	 * 留予子類褈寫
	 * 如刪注釋等
	 * @returns 
	 */
	processRaw(){
		const z = this
		return z.rawText
	}

		/**
	 * 取字串芝除註釋後者
	 * @param text 
	 * @returns 
	 */
	static rmComment(text:str,lineCommentMark:str){
		const z = this
		const pos = text.indexOf(lineCommentMark)
		if(pos < 0){
			return text
		}
		return text.slice(0, pos)
	}
}
