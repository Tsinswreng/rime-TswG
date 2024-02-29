# rime-TswG
rime-lua腳本及方案分享

lua腳本模塊:
predict.lua 動態聯想詞
userDict.lua 輸入歷史組詞記入詞庫
jp.lua 繁轉日
getSingleCharFromPhrase.lua 以詞定字
hintTrad.lua 簡體模式下提示傳統漢字
fillMenu.lua 單字組詞出候選


工具等:
config.lua 用戶配置
shared.lua 跨模塊共享變量/函數
type.lua librime-lua類型聲明
ArrayDeque.lua 循環數組雙端隊列
HistoryDeque.lua 繼承ArrayDeque用于錄限定個數的輸入歷史
ut.lua 工具
algo.lua 工具

方案:
dks 魔改上古音三拼
cangjie7-1 魔改三碼倉頡(已棄用)



## lua

### type.lua
針對librime-lua提供的接口的類型聲明。在編輯器(如vscode)中開啓相關插件後可獲得更好的代碼提示和類型檢查。

### ArrayDeque.lua
基于循環數組實現的雙端隊列

### HistoryDeque.lua
繼承ArrayDeque.lua、用于記錄有限個上屏記錄。隊列滿旹 再在隊尾添加元素 則會先使隊頭出隊。

### userDict.lua
使用HistoryDeque.lua
根據用戶輸入歷史組詞並寫入動態用戶詞庫
如 依次上屏`["輸","入","歷","史"]`四個字則會將
```
["輸入歷史", "入歷史", "歷史"]
```
記入當前方案所使用的userdb。下次可只需按srls(假設用的方案是拼音)即可使`輸入歷史`顯于候選
默認配置:
不錄單字
上屏歷史雙端隊列容量爲4。

### predict.lua
聯想詞。支持動態聯想
靜態聯想詞庫來自處理後的`essay.txt`
使用HistoryDeque.lua

### jp.lua
繁轉日


## 方案

### cangjie7-1

魔改三碼倉頡、今僅用于與主方案混輸及作輔助碼
首碼更改:
z: 辶
x: 訁
,: 彳
.: 絲

非首碼之構件
,:也
.:非

不足三碼者用`;`補

### hiragana katakana

日語假名。
拼音方案非全同羅馬音、而似IPA音位記音
<j> : /j/
<q> : っ
<l> : ー
x : 小寫假名


### dks
魔改上古音三拼(僅自用)
TODO 鍵盤圖
支持cangjie7-1混輸、可選`;`作後綴
支持cangjie7-1作輔助碼
輔助碼用例:
`kya`: /*krˁa/ 候選: 家傢鎵...
若此時欲`鎵`、則添`Co`、即`kyaCo`、緣`鎵`之倉頡碼首碼爲`c`、末碼爲`o`
首碼須大寫(即按住shift後對應的字符)、倉頡末碼可省

`:`: 地球拼音反查 陰平不標、;.,分別對應陽平、上聲、去聲。
`C`: 倉頡反查
`'`: 輸入平假名
`"`: 輸入片假名

