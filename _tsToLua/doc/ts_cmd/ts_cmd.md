# 命令

可以通過打字來執行一些操作。如輸入`$s`切換到簡體、輸入`$S`切換成繁體等。

默認用`$`號作爲命令前綴、用`,`作爲參數分隔符、用空格提交命令。

## 基本命令



- `$s`: 切換到簡體
- `$S`: 切換到繁體


- `$l`: 調用lua的`load`函數來上屏lua表達式的結果。可用作簡易計算。

如執行 `$l,2+3` 後上屏`5`; 執行`$l,'\t'`後上屏製表符; 執行`$l,math.log(5)` 上屏 `1.6094379124341`。

- `u`: 以十六進制上屏unicode字符。



第一個參數: 16進制unicode字符碼。 如 `$u,4e2d` -> `中`; 

第二個參數: 可選、表示上屏的字符數、按unicode順序遞增。

如 `$u,4000,10` -> `䀀䀁䀂䀃䀄䀅䀆䀇䀈䀉` (10個漢字、範圍為`U+4000`到`U+4009`)


## 其他命令

其他模塊也可調用此模塊、註冊自己的命令。

如在日語模塊中、注冊了一組開關命令 `$jp` 與 `$Jp`、分別用來開啓和關閉日本漢字ʰ轉換器。

詳見相應模塊的說明。

## 配置

rime.lua中:

```lua
local ts_cmd = require("TswG.mod.ts_cmd")
ts_cmd_P = ts_cmd.processor
ts_cmd_T = ts_cmd.translator
```

xxx.schema.yaml中:

```yaml
Tswg: {
  ,ts_cmd: {
    prompt: '$' # 命令提示符(前綴)
    ,argSeparator: ',' # 參數分隔符
  }
}

engine:
  processors:
    - lua_processor@ts_init_P
    - lua_processor@ts_cmd_P
  translators:
    - translator@ts_cmd_T

speller:
  alphabet: abcdefghijklmnopqrstuvwxyz$ # alphabet中要包含命提示符、這裏只是一個示例、請在實際的alphabet中添加$

recognizer:
  patterns:
   cmd: "^\\($).+$" # ()中的字符要與前面配置的prompt相同。

```

