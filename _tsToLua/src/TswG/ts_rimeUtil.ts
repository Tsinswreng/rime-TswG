import * as Str from '@/strUt'
import * as algo from '@/ts_algo'
// ---O(log n)
// ---當inputCode潙空: 車 -> ['che', 'ju']
// ---當inputCode潙'c'或'ch'或'che'旹: 車 -> ['che']
// ---若經inputCode篩選後無果則返篩選前ᵗ果
// ---@param db ReverseDb
// ---@param char string 單個漢字
// ---@param inputCode string|nil 㕥前綴匹配
// ---@return string[]
// function M.reverseLookupForSingleChar(db, char, inputCode)
// 	local codeStr = db:lookup(char) -- O(log n)
// 	local gotCodes = ut.splitString(codeStr, ' ') -- O(n)
// 	local ans = gotCodes
// 	--Wat(ans)
// 	--Wat(ans)
// 	if inputCode ~= nil and inputCode ~= '' then
// 		local inputCodeLen = utf8.len(inputCode)
// 		if inputCodeLen ~= nil then
// 			ans = {}
// 			for i, gotCode in ipairs(gotCodes)do
// 				-- local gotCodeSub = ut.utf8_sub(gotCode, 1, inputCodeLen)

// 				-- if gotCodeSub == inputCode then
// 				-- 	table.insert(ans, gotCode)
// 				-- end
// 				if algo.isAPrefixOfB(inputCode, gotCode) then
// 					table.insert(ans, gotCode)
// 				end
// 			end
// 		end
// 	end
// 	if #ans == 0 then --當輸入含輔助碼旹 如 伊蕾娜 qda ruyT nzy 、 緣 蕾ᵗ碼多出一'T'致前綴匹配旹無ʃ匹得
// 		ans = gotCodes
// 	end
// 	--log.error('codes') #
// 	return ans
// end


/**
 * O(log n)
 * 當inputCode潙空: 車 -> ['che', 'ju']
 * 當inputCode潙'c'或'ch'或'che'旹: 車 -> ['che']
 * 若經inputCode篩選後無果則返篩選前ᵗ果
 * @param db ReverseDb
 * @param char string 單個漢字
 * @param inputCode string|nil 㕥前綴匹配
 * @returns string[]
 */
export function reverseLookupForSingleChar(db:ReverseDb, char:str, inputCode:str|undef){
	const codeStr = db.lookup(char)
	const gotCodes = Str.split(codeStr, ' ')
	let ans = gotCodes
	if(inputCode != void 0 && inputCode !== ''){
		const inputCodeLen = Str.utf8Len(inputCode)
		if(inputCodeLen != void 0){
			ans = []
			for(const gotCode of gotCodes){
				if( Str.isPrefix(gotCode, inputCode) ){
					ans.push(gotCode)
				}
			}
		}
	}

	if(ans.length === 0){ //當輸入含輔助碼旹 如 伊蕾娜 qda ruyT nzy 、 緣 蕾ᵗ碼多出一'T'致前綴匹配旹無ʃ匹得
		ans = gotCodes
	}
	return ans
}


// --- ['睡','覺'] -> [['shui'], ['jiao', 'jue']]
// ---@param db ReverseDb
// ---@param chars string[] 單字ᵗ數組
// ---@param inputCodes string[]|nil 㕥前綴匹配
// ---@return string[][]
// function M.seekCodesOfChars_2dArr(db, chars, inputCodes)
// 	inputCodes = inputCodes or {}
// 	local reverse = {} ---@type string[][]
// 	for i,char in ipairs(chars)do
// 		local input = inputCodes[i]
// 		local ua = M.reverseLookupForSingleChar(db, char, input)
// 		reverse[i] = ua
// 	end
	
// 	return reverse
// end


/**
 * ['睡','覺'] -> [['shui'], ['jiao', 'jue']]
 * @param db 
 * @param chars 單漢字 數組
 * @param inputCodes 㕥前綴匹配
 * @returns 
 */
export function seekCodesOfChars_2dArr(db:ReverseDb, chars:str[], inputCodes:str[]|nil){
	inputCodes = inputCodes??[]
	const reverse = [] as str[][]
	for(let i = 0; i < chars.length; i++){
		const char = chars[i]
		const input = inputCodes[i]
		const ua = reverseLookupForSingleChar(db, char, input)
		reverse[i] = ua
	}
	return reverse
}

// --- ['睡','覺'] -> ['shui jiao', 'shui jue']
// ---@param db ReverseDb
// ---@param chars string[] 單字數組
// ---@param inputCodes string[]|nil 㕥前綴匹配
// ---@return string[] ---末無空格、異於用戶詞庫中之custom_code
// function M.seekCodesOfChars(db, chars, inputCodes)
// 	local codes_2dArr = M.seekCodesOfChars_2dArr(db, chars, inputCodes)
// 	return algo.combineStr2dArr(codes_2dArr)
// end

/**
 * //TODO test
 * ['睡','覺'] -> ['shui jiao', 'shui jue']
 * @param db 
 * @param chars ['睡','覺']  單字數組
 * @param inputCodes 㕥前綴匹配
 * @returns 末無空格、異於用戶詞庫中之custom_code
 */
export function seekCodesOfChars(db:ReverseDb, chars:str[], inputCodes:str[]|undef){
	const codes_2dArr = seekCodesOfChars_2dArr(db, chars, inputCodes) // [['shui'], ['jiao', 'jue']]
	const d2 = algo.cartesianProduct(codes_2dArr) // [['shui', 'jiao'], ['shui', 'jue']]
	return d2.map(e=>e.join(' '))
}

// --- "睡覺" -> ['shui jiao', 'shui jue']
// ---@param db ReverseDb
// ---@param str string
// ---@param inputCodes string[]|nil 㕥前綴匹配
// ---@return string[]
// function M.seekCodesOfStr(db, str, inputCodes)
// 	local chars = ut.splitString(str, '')
// 	local ans = M.seekCodesOfChars(db, chars, inputCodes)
// 	return ans
// end

/**
 * "睡覺" -> ['shui jiao', 'shui jue']
 * @param db 
 * @param str 
 * @param inputCodes 㕥前綴匹配
 */
export function seekCodesOfStr(db:ReverseDb, str:str, inputCodes:str[]|undef){
	const chars = Str.split(str, '')
	const ans = seekCodesOfChars(db, chars, inputCodes)
	return ans
}

export function getDictName(schema:Schema){
	return schema.config.get_string('translator/dictionary')
}

export function mapTranslation<T>(translation:Translation, fn:(e:Candidate)=>T){
	const ans = [] as T[]
	for(const cand of translation.iter()){
		const ua = fn(cand)
		ans.push(ua)
	}
	return ans
}