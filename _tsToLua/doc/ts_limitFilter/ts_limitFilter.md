# ts_limitFilter

文件位置: `_tsToLua/src/TswG/mod/ts_limitFilter.ts`

## 作用
限制filter處理的候選詞數量。默認超過128個則不再產生候選、用于與其他模塊組合而減小卡頓。

## 部署

在`rime.lua`中:

```lua
local ts_limitFilter = require('TswG.mod.ts_limitFilter')
ts_limitFilter_F = ts_limitFilter.filter
```

在`schema.yaml`中:

```yaml
engine:
  filters:
    - lua_filter@ts_limitFilter_F # 宜加在所    filter之前。因在此之後的filter纔會被限制。
```