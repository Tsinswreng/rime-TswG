## 全局Array
2024-05-18T18:45:18.540+08:00
不能用
```ts
let a = Array(2) //x 報錯 無全局變量芝謂Array者
let b = new Array(2) // 報錯 lualib_bundle
```


## 拋錯誤
2024-05-12T12:18:03.995+08:00
```ts
throw new Error()
```
會被轉譯成
```lua
error(
	__TS__New(
		Error
	),
	0
)
```

若該錯誤對象ˋ未被捕則輸入法ˋ直ᵈ崩
肰用error()未捕則不崩

## MyClass.prototype.toString()
2024-05-12T12:25:06.562+08:00
ts中調用`xxx.toString()`方法旹、編譯成lua後 潙 `tostring(xxx)`
