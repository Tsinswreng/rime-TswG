//@ts-ignore
import * as _global from '@/_global'
_global


// package_.path = package_.path+';'+rime_api.get_user_data_dir()+'/lua/TswG/?.lua'
// package_.path = package_.path+';'+rime_api.get_user_data_dir()+'/lua/TswG/mod/?.lua'


//Wat(os.getenv('path'))

const global_value = require('global_value')


import * as ts_init from '@/ts_init'
declare var ts_init_P
ts_init_P = ts_init.processor



const init = require('init') //---應最先加載
declare var init_P
init_P = init.processor //---此組件當置于processors最前


//const unitTestRun = require('unitTestRun')
import * as unitTestRun from '@/unitTestRun'
declare var unitTestRun_P
unitTestRun_P = unitTestRun.processor



const ut = require("ut")
declare var Wat:(this:void, v:any)=>void
Wat = ut.logWarnJson //-- 曰


//-- local getMills = require('getMilliseconds')
//-- Wat(getMills)

//-- Wat(require('libTswG').getMilliseconds())

//-- local socket = require("_lib.luapower_socket.socket")
//-- local socket = require'socket'
//-- Wat(socket)




//-- do
//-- 	local ok,res =  pcall(function()
//-- 		local simplehttp = require('simplehttp_ok')
//-- 		Wat('ok0')
//-- 	end)
//-- 	Wat(ok)
//-- 	Wat(res)
//-- end
//--Wat(package.cpath)
//--  C:\Program Files (x86)\Rime\weasel-0.15.0\?.dll;C:\Program Files (x86)\Rime\weasel-0.15.0\..\lib\lua\5.4\?.dll;C:\Program Files (x86)\Rime\weasel-0.15.0\loadall.dll;.\?.dll
//--Wat(rime_api.get_user_data_dir()) d:\Program Files\Rime\User_Data


//-- local libPath = 'D:\\Program Files\\Rime\\User_Data\\_tsToLua\\src\\mod\\testDll\\mylib.dll'
//-- do
//-- 	local ok,res =  pcall(function()
//-- 		local mylib = package.loadlib(libPath, 'hello')
//-- 		Wat(mylib)
//-- 		Wat('ok')
//-- 	end)
//-- 	Wat(ok)
//-- 	Wat(res)
//-- end


//-- do
//-- 	local ok,res =  pcall(function()
//-- 		local mylib = require('socket')
		
//-- 		Wat(mylib)
//-- 		mylib.hello()
//-- 		Wat('ok')
//-- 	end)
//-- 	Wat(ok)
//-- 	Wat(res)
//-- end



//-- Wat(add)

//-- local test_dll = require('libtest_dll')

//-- require('mylib').hello()

//--- 百度云拼音，Control+t 为云输入触发键
//--- 使用方法：
//--- 将 "lua_translator@baidu_translator" 和 "lua_processor@baidu_processor"
//--- 分别加到输入方案的 engine/translators 和 engine/processors 中
// const baidu = require("trigger")("Control+t", require("baidu"))

// declare var baidu_translator = baidu.translator
// declare var baidu_processor = baidu.processor



const info1S = debug.getinfo(1,"S")
const short_src = info1S.short_src
//const curDir = ut.resolveDir(short_src)
//TswG.userDataDir = curDir



//-- luaSelector = require("selector").processor
//-- simplifier = require('simplifier').filter

const committedWordSaver = require('committedWordSaver')
declare var committedWordSaver_P
committedWordSaver_P = committedWordSaver.processor

const userWordCombiner = require("userWordCombiner")
declare var userWordCombiner_P
userWordCombiner_P = userWordCombiner.processor

// const fillMenu = require('fillMenu')
// declare var fillMenuF = fillMenu.filter
// declare var fillMenuT = fillMenu.translator


//const date = require('date')
import * as date from '@/mod/date'
declare var date_T
date_T = date.translator

//--Wat(date.translator.func())
//--date.translator.func()

//-- Wat(date_T)
//-- Wat(date_T['init'])
//-- Wat(date_T['func'])
//-- Wat(date_T['fini'])
//-- date_T.func()

// declare var time_translator = require("time_translator")
declare var getSingleCharFromPhrase
getSingleCharFromPhrase = require("getSingleCharFromPhrase")

//--local asciiModeSwitch = require('asciiModeSwitch')
//--asciiModeSwitch_P = asciiModeSwitch.processor

//--[[ English = require("english0")()
// english_processor = English.processor
// english_segmentor = English.segmentor
// english_translator = English.translator
// english_filter = English.filter ]]
//-- require'socket'

//const ts_predict = require('ts_predict')
import * as ts_predict from '@/mod/ts_predict'
declare var ts_predict_P
declare var ts_predict_S
declare var ts_predict_T
declare var ts_predict_F

ts_predict_P = ts_predict.processor
ts_predict_S = ts_predict.segmentor
ts_predict_T = ts_predict.translator
ts_predict_F = ts_predict.filter

import * as fixedTeengqPeeng from '@/mod/fixedTeengqPeeng'

declare var fixedTeengqPeeng_P
fixedTeengqPeeng_P= fixedTeengqPeeng.processor



//--[[ local predict = require("predict")
// declare var predict_P = predict.processor
// declare var predict_T = predict.translator ]]

//-- local limitFilter = require('limitFilter')
//-- limitFilter_F = limitFilter.filter

// const limitFilter = require('ts_limitFilter')
import * as limitFilter from '@/mod/ts_limitFilter'
declare var limitFilter_F
limitFilter_F = limitFilter.filter

// const tradHint = require('tradHint')
// declare var tradHintF = tradHint.filter

//--[[ local qualityHint = require('qualityHint')
// qualityHint_F = qualityHint.filter ]]

// const ts_commentQuality = require('ts_commentQuality')
import * as ts_commentQuality from '@/mod/ts_commentQuality'
declare var ts_commentQuality_F
ts_commentQuality_F = ts_commentQuality.filter

import * as commentUnicode from '@/mod/commentUnicode'
declare var commentUnicode_F
commentUnicode_F = commentUnicode.filter

import * as ipa from '@/mod/ipa'
declare var ipa_P
ipa_P = ipa.processor



//--[[ local jp = require('jp')
// jp_T = jp.translator
// jp_F = jp.filter ]]

// const ts_t2jp = require('ts_t2jp')
import * as ts_t2jp from '@/mod/ts_t2jp'
declare var ts_t2jp_F
ts_t2jp_F = ts_t2jp.filter

// //--[[ unicodeHint = require('unicodeHint')
// unicodeHint_F = unicodeHint.filter ]]

const filterOnAdditionalCode = require("filterOnAdditionalCode")
declare var filterOnAdditionalCode_F
filterOnAdditionalCode_F = filterOnAdditionalCode.filter

import * as dks_filterOnAdditionalCode from '@/mod/dks/filterOnAdditionalCode'
declare var dks_filterOnAdditionalCode_F
dks_filterOnAdditionalCode_F = dks_filterOnAdditionalCode.filter

// //--[[ local deleteSelectionOn0 = require('deleteSelectionOn0')
// deleteSelectionOn0_P = deleteSelectionOn0.processor ]]

//const deleteSelectionOn0 = require('deleteSelectionOn0')
import * as deleteSelectionOn0 from '@/mod/ts_deleteSelectionOn0'
declare var deleteSelectionOn0_P
deleteSelectionOn0_P = deleteSelectionOn0.processor

// //--[[ local clearOnKey = require('clearOnKey')
// clearOnKey_P = clearOnKey.processor ]]

// const ts_clearOnShift = require('ts_clearOnShift')
import * as ts_clearOnShift from '@/mod/ts_clearOnShift'
declare var ts_clearOnShift_P
ts_clearOnShift_P = ts_clearOnShift.processor

const cmd = require('cmd')
declare var cmd_P
cmd_P = cmd.processor



//const ts_cmd = require('TswG.mod.cmd.ts_cmd')
import * as ts_cmd from '@/mod/cmd/ts_cmd'
declare var ts_cmd_P
declare var ts_cmd_T
ts_cmd_P = ts_cmd.processor
ts_cmd_T = ts_cmd.translator
import * as basicCmds from '@/mod/cmd/cmds/basicCmds'
if(false){
	let a = basicCmds
}

import * as commitHistoryLdb from '@/mod/commitHistoryLdb'
declare var commitHistoryLdb_P
commitHistoryLdb_P = commitHistoryLdb.processor

import * as coinage from '@/mod/coinage'
declare var coinage_P
coinage_P = coinage.processor


import * as fixedSingleLetterCand from '@/mod/fixedSingleLetterCand'
declare var fixedSingleLetterCand_F
fixedSingleLetterCand_F = fixedSingleLetterCand.filter


//const voca = require('voca.mod')
import * as ngaq from '@/mod/ngaq/mod'
declare var ngaq_P
declare var ngaq_T
declare var ngaq_F

ngaq_P = ngaq.processor
ngaq_T = ngaq.translator
ngaq_F = ngaq.filter

//const phraseReverse = require('phraseReverse')
import * as phraseReverse from '@/mod/phraseReverse'
declare var phraseReverse_F
phraseReverse_F = phraseReverse.filter

import * as longWordPredict from '@/mod/longWordPredict'
declare var longWordPredict_F
longWordPredict_F = longWordPredict.filter


import * as mixJp from '@/mod/mixJp'
declare var mixJp_S
declare var mixJp_T
mixJp_S = mixJp.segmentor
mixJp_T = mixJp.translator
//-- Wat("require('voca.srv')")
//-- require('voca.srv')


//-- local testTstl = require('testTstl').M
//-- testTstl_P = testTstl.processor
//--[[ userPhrase = require('userPhrase')
// declare var userPhrase_P = userPhrase.processor ]]

//--[[ hybrid = require('hybrid')
// hybrid_P = hybrid.processor
// hybrid_S = hybrid.segmentor ]]

//--[[ commitIntercept = require('commitIntercept')
// commitIntercept_P = commitIntercept.processor ]]

//--[[ unicode = require('unicode')
// unicode_T = unicode.translator ]]

//--my_component = require('my_component')
//--my_component_T = my_component.translator

//error('err')
//Wat(new Error('err')) nil
//Wat(debug.traceback('trace', 3))
//Wat(new Error('err').stack)
// Wat(new Error('err').toString())
// console.log(1)
// try {
// 	throw new Error('try')
// } catch (error) {
// 	Wat(error)
// 	Wat(error instanceof Error)
// }

log.warning(" < rime.lua")
