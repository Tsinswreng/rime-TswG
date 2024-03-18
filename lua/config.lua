---默認配置
local M = {}
local default = {} ---@class LuaConfig

default.predict = {
	charToPush = '^' -- 須在speller中 
	,switchName = 'predict' --此模塊的開關ˋ在schema中之名 須添加在switches中
	,noComment = true -- 爲true旹 聯想候選無註釋
	,reverseName = 'prd'
	,predictCandTag = 'prd'
	,defaultPredict = {'的','一','是','了','我'} ---$默認添加到最後的聯想詞、㕥防搜索不到候選或候選過少
	,commitHistoryDepth = 4 --- $輸入歷史ˉ雙端隊列之最大容量
	,splitterOfpredictWord__quality = '_' --- $dict.yaml中聯想詞與默認權重之分隔符
}
default.predict.reverseDbPath = 'build_/'..default.predict.reverseName..'.reverse.bin'

default.userWordCombiner = {
	fullPunctArr = {'。','、','，','！','？','：','；','《','》','「','」','‘','’','“','”','ˋ'}
	,ignoreSingleChar = true ---不錄單字 若錄單字則以輔助碼輸單字旹會使其字ᵗ頻ˋ增
	,delimiter = '|' ---$ 實際顯示的分隔符、緣可能經preeditˋᵗ改、故未必同schema中之delimiter
}

default.cmd = {
	prompt = '$' ---須在speller/alphabet中
	,paramSplitter = ','
	,useSpace = false
	,submitKey = function (key) ---@param key KeyEvent
		return key:repr() == 'space'
	end
}

default.clipboard = {
	outputFile = rime_api.get_user_data_dir() .. '/' .. 'clipboard.txt'
}

default.jp = {
	switchName = 'japanese_kanji'
}

default.qualityHint = {
	switchName = 'hint_quality'
}

default.charInPhrase = {

}

--使某個方案配置異於全局配置 中括號內填方案ID
M['dks'] = { ---@type LuaConfig
	predict = {
		charToPush = '^'
	}
}

M.default = default
return M