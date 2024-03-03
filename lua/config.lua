---默認配置
local M = {}
local default = {} ---@class LuaConfig

default.predict = {
	charToPush = '^' -- 須在speller中 
	,switchName = 'predict'
}

default.userWordCombiner = {
	fullPunctArr = {'。','、','，','！','？','：','；','《','》','「','」','‘','’','“','”','ˋ'}
	,ignoreSingleChar = true ---不錄單字 若錄單字則以輔助碼輸單字旹會使其字ᵗ頻ˋ增
	,delimiter = '|' ---$ 實際顯示的分隔符、緣可能經preeditˋᵗ改、故未必同schema中之delimiter
}

default.cmd = {
	prompt = '$' ---須在speller/alphabet中
	,paramSplitter = ','
}

default.jp = {
	switchName = 'japanese_kanji'
}

M['dks'] = { ---@type LuaConfig
	predict = {
		charToPush = '^'
	}
}

M.default = default
return M