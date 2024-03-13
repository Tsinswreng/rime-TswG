---2024-02-05T18:20:49.000+08:00
--conjunctive=require("conjunctive/init")
--return
log.warning(" > rime.lua")
local init = require('init') ---應最先加載
init_P = init.processor ---此組件當置于processors最前
TswG={}

local ut = require("ut")

Wat = ut.logWarnJson -- 曰

local info1S = debug.getinfo(1,"S")
local short_src = info1S.short_src
local curDir = ut.resolveDir(short_src)
TswG.userDataDir = curDir



-- luaSelector = require("selector").processor
-- simplifier = require('simplifier').filter

local userWordCombiner = require("userWordCombiner")
userWordCombiner_P = userWordCombiner.processor

local fillMenu = require('fillMenu')
fillMenuF = fillMenu.filter
fillMenuT = fillMenu.translator

time_translator = require("time_translator")
getSingleCharFromPhrase = require("getSingleCharFromPhrase")

--[[ English = require("english0")()
english_processor = English.processor
english_segmentor = English.segmentor
english_translator = English.translator
english_filter = English.filter ]]

local predict = require("predict")
predict_P = predict.processor
predict_T = predict.translator

local limitFilter = require('limitFilter')
limitFilter_F = limitFilter.filter

local tradHint = require('tradHint')
tradHintF = tradHint.filter

local qualityHint = require('qualityHint')
qualityHint_F = qualityHint.filter

local jp = require('jp')
jp_T = jp.translator
jp_F = jp.filter

--[[ unicodeHint = require('unicodeHint')
unicodeHint_F = unicodeHint.filter ]]

local filterOnAdditionalCode = require("filterOnAdditionalCode")
filterOnAdditionalCode_F = filterOnAdditionalCode.filter

local deleteSelectionOn0 = require('deleteSelectionOn0')
deleteSelectionOn0_P = deleteSelectionOn0.processor

local clearOnKey = require('clearOnKey')
clearOnKey_P = clearOnKey.processor

local cmd = require('cmd')
cmd_P = cmd.processor

--[[ userPhrase = require('userPhrase')
userPhrase_P = userPhrase.processor ]]

--[[ hybrid = require('hybrid')
hybrid_P = hybrid.processor
hybrid_S = hybrid.segmentor ]]

--[[ commitIntercept = require('commitIntercept')
commitIntercept_P = commitIntercept.processor ]]

--[[ unicode = require('unicode')
unicode_T = unicode.translator ]]

--my_component = require('my_component')
--my_component_T = my_component.translator

log.warning(" < rime.lua")
