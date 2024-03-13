

--AI prompt
--[[ 
根据文档、请帮我仿照以下风格写emmylua的类型注解
对于属性:
---@class MyClass
---@field 属性名 类型名 --- (解释)

对于方法:
---  (解释)
---@param self MyClass
---@param param2 someType
---@return ReturnType
function MyClass.myFunc(self:MyClass, param2:someType):ReturnType
	
end
要求:注释要写三条短横、(解释)要用文档中实际的解释说明代替。没有就留空。
 ]]

if false then 

---@class unknown: any

---@class ConfigList
---@class ConfigMap
---@class ConfigValue
---@class CommitRecord



---@param table table
---@return Set
function Set(table)end
---@class Set
---@field empty fun(self:Set):boolean
---@field __index fun(self:Set)
---@field __add fun(self:Set)
---@field __sub fun(self:Set)
---@field __mul fun(self:Set)
---@field __set fun(self:Set)



---@class Preedit
---@field text string --- 似 在segmentor.func中印此則無delimiter、肰在即將上屏旹印㞢則有
---@field caret_pos integer
---@field sel_start integer
---@field sel_end integer


---@class Composition
---@field empty fun(self:Composition):boolean ---尚未开始编写（无输入字符串、无候选词）
---@field back fun(self:Composition):Segment ---获得队尾（input字符串最右侧）的 Segment 对象
---@field pop_back fun(self:Composition):nil ---去掉队尾的 Segment 对象
---@field push_back fun(self:Composition, e:Segment):nil ---	在队尾添加一个 Segment对象
---@field has_finished_composition fun(self:Composition):boolean --?
---获得队尾的 Segment 的 prompt 字符串（prompt 为显示在 caret 右侧的提示，比如菜单、预览输入结果等）
---@field get_prompt fun(self:Composition):string
---@field toSegmentation fun(self:Composition):Segmentation --?

---@class Connection
---@field disconnect fun(self:Config)


---@class Notifier
---@field connect fun(self:Notifier, func:fun(ctx:Context), grup: integer|nil):Connection

---@class OptionUpdateNotifier:Notifier
---@field connect fun(self:Notifier, func:fun(ctx:Context, name:string), grup: integer|nil):Connection

---@class PropertyUpdateNotifier:Notifier
---@field connect fun(self:Notifier, func:fun(ctx:Context, name:string), grup: integer|nil):Connection

---@class KeyEventNotifier:Notifier
---@field connect fun(self:Notifier, func:fun(ctx:Context, key:KeyEvent), grup: integer|nil):Connection

--[[ ---@field Candidate fun(type:string, start:number, end:number, text:string, comment:string):Candidate ]]
---@param type string
---@param start number
---@param end_ number
---@param text string
---@param comment string
---@return Candidate
function Candidate(type, start, end_, text, comment)end

---@class Candidate
---@field type 'user_phrase'|'phrase'|'punct'|'simplified'|'completion'|'compoletion' --- 文檔曰有completion、官ᵗ示例代碼有compoletion
---@field start number
---@field _start number
---@field _end number
---@field quality number
---@field text string
---@field comment string
---@field preedit string
---@field get_dynamic_type fun(self:Candidate):string
---@field get_genuine fun(self:Candidate):Candidate ---原本的Candidate、如對ShadowCandidate對象調此方法 則得Candidate對象芝構造ShadowCandidate旹傳入其構造函數者
---@field get_genuines fun(self:Candidate):table<number, Candidate>
---@field to_shadow_candidate fun(self:Candidate)
---@field to_uniquified_candidate fun(self:Candidate)
---@field append fun(self:Candidate)

---典型地，simplifier 繁简转换产生的新候选词皆为ShadowCandidate
---@param cand Candidate
---@param type string
---@param text string
---@param comment string
---@param inherit_comment string|nil
---@return ShadowCandidate
function ShadowCandidate(cand, type, text, comment, inherit_comment)end
---@class ShadowCandidate : Candidate


---@class Context
---@field composition Composition
---@field input string
---@field caret_pos number
---@field commit_notifier Notifier --上屏前通知?
---@field select_notifier Notifier
---@field update_notifier Notifier
---@field delete_notifier Notifier
---选项改变通知，使用 connect 方法接收通知
---@field option_update_notifier OptionUpdateNotifier
---@field property_update_notifier PropertyUpdateNotifier
---@field unhandled_key_notifier KeyEventNotifier
---@field commit fun(self: Context)  --- 上屏选中的候选词
---@field get_commit_text fun(self: Context): string --- 已選中ᵗ項(高亮)
---@field get_script_text fun(self: Context): string  -- 按音节分割
---@field get_preedit fun(self: Context): Preedit
---@field is_composing fun(self: Context): boolean  -- 是否正在输入（输入字符串非空或候选词菜单非空）
---@field has_menu fun(self: Context): boolean  -- 是否有候选词（选项菜单） 只有input而無候選旹亦返false
---@field get_selected_candidate fun(self: Context): Candidate  -- 返回选中的候选词
---@field push_input fun(self: Context, text: string)  ---在caret_pos位置插入指定的text编码字符串，caret_pos跟随右移
---@field pop_input fun(self: Context, num: number): boolean  -- 在caret_pos位置往左删除num指定数量的编码字符串，caret_pos跟随左移
---@field delete_input fun(self: Context)  -- 删除输入的内容
---@field clear fun(self: Context)  -- 清空正在输入的编码字符串及候选词
---@field select fun(self: Context, index: number): boolean  -- 选择第index个候选词（序号从0开始）
---@field confirm_current_selection fun(self: Context)  -- 确认选择当前高亮选择的候选词（默认为第0个）
---@field delete_current_selection fun(self: Context): boolean  -- 删除当前高亮选择的候选词
---@field confirm_previous_selection fun(self: Context)
---@field reopen_previous_selection fun(self: Context)  -- 重新打开上一个选项
---@field clear_previous_segment fun(self: Context)
---@field reopen_previous_segment fun(self: Context)  -- 重新打开上一个段
---@field clear_non_confirmed_composition fun(self: Context)
---@field refresh_non_confirmed_composition fun(self: Context)  -- 刷新非确认的组成
---@field set_option fun(self: Context, option:string, state:boolean)
---@field get_option fun(self: Context, option:string):boolean --- 文檔未言有入參
---@field set_property fun(self: Context, key: string, value: string)  -- 可以用于存储上下文信息（可配合 property_update_notifier 使用）
---@field get_property fun(self: Context, key: string): string
---@field clear_transient_options fun(self: Context)  -- 清除临时选项


---@class Engine
---@field schema Schema
---@field context Context
---@field active_engine any
---@field process_key fun(self: Engine, keyEvent:KeyEvent)
---@field compose fun(self: Engine): Candidate[] ???
---@field commit_text fun(self: Engine, text: string) -- 上屏 text 字符串
---@field apply_schema fun(self: Engine)   -- apply_schema 方法接受 Engine 类型的 self 参数


---@class Env --- 此元之域ᵘ、文檔ʸ不詳。
---@field engine Engine
---@field name_space string

---@alias yield fun(cand:Candidate):nil

---@class KeyEvent
---@field keycode number
---@field modifier number
---@field shift fun(self:KeyEvent):boolean
---@field ctrl fun(self:KeyEvent):boolean
---@field alt fun(self:KeyEvent):boolean
---@field super fun(self:KeyEvent):boolean
---@field release fun(self:KeyEvent):boolean
---@field caps fun(self:KeyEvent):boolean
---representation 修饰键（含release）＋按键名（若没有按键名，则显示4位或6位十六进制X11按键码位 ≠ Unicode）
---@field repr fun(self:KeyEvent):string
---equal
---@field eq fun(self:KeyEventNotifier, key:KeyEvent):boolean

---@alias KeyEvent_constructor fun(repr:string):KeyEvent --- 文檔未云有此構造函數、但見Component示例中有此用法
KeyEvent = KeyEvent---@type KeyEvent_constructor



---@param param string|nil
---@return KeySequence
function KeySequence(param)end
---@class KeySequence
---@field parse fun(self:KeySequence, str:string):nil ---?
---@field repr fun(self:KeySequence):string
---@field toKeyEvent fun(self:KeySequence):KeyEvent|nil --失敗旹返nil?

--env = env ---@type Env
---Candidate = Candidate ---@type Candidate
yield = yield ---@type yield


--- 配置对象，可以通过 env.engine.schema.config 获得
---@class Config
Config=Config
--- 判断指定路径的配置是否为空
---@param self Config
---@param conf_path string 配置路径
---@return boolean 若不存在配置或配置为空，则返回 true，否则返回 false
function Config.is_null(self, conf_path) end

--- 判断指定路径的配置是否为值类型
---@param self Config
---@param conf_path string 配置路径
---@return boolean 若存在并且为值类型配置，则返回 true，否则返回 false
function Config.is_value(self, conf_path) end

--- 判断指定路径的配置是否为列表类型
---@param self Config
---@param conf_path string 配置路径
---@return boolean 若存在并且为列表类型配置，则返回 true，否则返回 false；若不存在配置，则返回 true
function Config.is_list(self, conf_path) end

--- 判断指定路径的配置是否为映射类型
---@param self Config
---@param conf_path string 配置路径
---@return boolean 若存在并且为映射类型配置，则返回 true，否则返回 false
function Config.is_map(self, conf_path) end

--- 根据配置路径获取配置的字符串值
---@param self Config
---@param conf_path string 配置路径
---@return string 配置的字符串值
function Config.get_string(self, conf_path) end

--- 设置指定路径的配置为字符串值
---@param self Config
---@param path string 配置路径
---@param str string 字符串值
function Config.set_string(self, path, str) end

--- 根据配置路径获取列表类型的配置
---@param self Config
---@param conf_path string 配置路径
---@return ConfigList 若不存在或不为列表类型，则返回 nil
function Config.get_list(self, conf_path) end

--- 根据配置路径获取映射类型的配置
---@param self Config
---@param conf_path string 配置路径
---@return ConfigMap 若不存在或不为映射类型，则返回 nil
function Config.get_map(self, conf_path) end

--- 设置指定路径的配置为值类型的配置
---@param self Config
---@param path string 配置路径
---@param value ConfigValue 值类型的配置
function Config.set_value(self, path, value) end

---@enum



---@class Schema
---@field schema_id string
---@field schema_name string
---@field config Config
---@field page_size number
---@field select_keys string --?

---@param schema_id string
---@return Schema
function Schema(schema_id)end
Schema=Schema


--[[ ---@alias ProcessorFn1 fun(engine:Engine, schema:Schema, name_space:string, presciption:string)
---@alias ProcessorFn2 fun(engine:Engine, name_space:string, presciption:string)
---@alias ProcessorFn ProcessorFn1|ProcessorFn2 ]]

---@alias kReject 0
---@alias kAccepted 1
---@alias kNoop 2
---@alias KeyRAN kReject|kAccepted|kNoop

---@class Processor
---@field nams_space string
---@field process_key_event fun(self:Processor, key_event:KeyEvent):KeyRAN

---@class Segmentor
---@field name_space string
---@field proceed fun(self:Segmentor, segmentation:Segmentation):boolean


---@param start_pos integer
---@param end_pos integer
---@return Segment
function Segment(start_pos, end_pos)end

---@class Segment
---kVoid - （默认）  kSelected - 大于此状态才会被视为选中
---@field status 'kVoid'|'kGuess'|'kSelected'|'kConfirmed'
---@field start number ---文檔未註此ᵗ類型
---@field _start number ---文檔未註此ᵗ類型
---@field end number ---文檔未註此ᵗ類型
---@field _end number ---文檔未註此ᵗ類型
---@field length number ---文檔未註此ᵗ類型
---@field tags Set
---@field menu unknown
---@field selected_index number ---文檔未註此ᵗ類型
---@field prompt string
---@field clear fun(self:Segment):nil
---@field close fun(self:Segment):nil
---@field reopen fun(self:Segment):nil
---@field has_tag fun(self:Segment, tag:string):boolean
---@field get_candidate_at fun(self:Segment, index:number):Candidate --- index 始自零
---@field get_selected_candidate fun(self:Segment):Candidate


---@class Segmentation
---@field input string --- 脱字符之前之字串
---@field empty fun(self:Segmentation):boolean
---@field back fun(self:Segmentation):Segment
---@field pop_back fun(self:Segmentation):Segment
---@field reset_length fun(self:Segmentation, size_t:number) ----保留 n 個 Segment
---新增 一個 kVoid 的 Segment(start_pos = 前一個 end_pos , end_pos = start_pos)
---@field add_segment fun(self:Segmentation, seg:Segment)
---@field forward fun(self:Segmentation):boolean
---@field trim fun(self:Segmentation):nil
---@field has_finished_segmentation fun(self:Segmentation):boolean
---@field get_current_start_position fun(self:Segmentation):number
---@field get_current_end_position fun(self:Segmentation):number
---@field get_current_segment_length fun(self:Segmentation):number
---属性 input 中已经确认（处理完）的长度
---（通过判断 status 为 kSelected 或 kConfirmed 的 Segment 的 _end 来判断 confirmed_position）
---https://github.com/rime/librime/.../src/segmentation.cc#L127
---@field get_confirmed_position fun(self:Segmentation):number


Translation = Translation
---@class Translation
---@field iter fun(self:Translation):fun():Candidate

Translator=Translator
---@class Translator
---@field name_space string
---@field query fun(self:Translator, input:string, segmet:Segment):Translation

--[[ ---@param self Translator
---@param input string
---@param segmet Segmentor
---@return Translation
function Translator:query(input, segmet)end -- 此不效 ]]

---@class Filter
---@field name_sapce string
---@field apply fun(self:Filter, translation:Translation, cands:Candidate[]):Translation

---@class Component
---調用 processor, segmentor, translator, filter 組件，可在lua script中再重組。 參考範例: librime-lua/sample/lua/component_test.lua
--[[ -@field Processor ProcessorFn
-@field Segmentor ProcessorFn
-@field Translator ProcessorFn
-@field Filter ProcessorFn ]]
Component = Component

---如：Component.Processor(env.engine, "", "ascii_composer"), 
---Component.Processor(env.engine, Schema('cangjie5'), "", 'ascii_composer)(使用Schema: cangjie5 config)
---@overload fun(engine:Engine, schema:Schema, name_space:string, presciption:string):Processor
---@overload fun(engine:Engine, name_space:string, presciption:string):Processor
---@return Processor
function Component.Processor(...)end

---@overload fun(engine:Engine, schema:Schema, name_space:string, presciption:string):Segmentor
---@overload fun(engine:Engine, name_space:string, presciption:string):Segmentor
---@return Segmentor
function Component.Segmentor(...)end


---@overload fun(engine:Engine, schema:Schema, name_space:string, presciption:string):Translator
---@overload fun(engine:Engine, name_space:string, presciption:string):Translator
---@return Translator
function Component.Translator(...)end

---@overload fun(engine:Engine, schema:Schema, name_space:string, presciption:string):Filter
---@overload fun(engine:Engine, name_space:string, presciption:string):Filter
---@return Filter
function Component.Filter(...)end


---@param file_name string
---@return ReverseDb
function ReverseDb(file_name)end
---@class ReverseDb
---@field lookup fun(self:ReverseDb, text:string):string


---ReverseLookup = ReverseDb

---@param name string
---@return ReverseDb ---?
function ReverseLookup(name)end
---@class ReverseLookup
---@field lookup fun(self:ReverseLookup, key:string):string
---@field lookup_stems fun(self:ReverseLookup):unknown



---@alias ProcessorFn fun(keyEvent:KeyEvent, env:Env):KeyRAN
---@alias SegmentorFn fun(segmentation:Segmentation, env:Env)
---@alias TranslatorFn fun(input:string, seg:Segment, env:Env)
---@alias FilterFn fun(translation:Translation, env:Env, cands:Candidate)

-- -@class Module
-- -@field processor table|nil
-- -@field segmentor table|nil
-- -@field translator table|nil
-- -@field translator table|nil

---@class DbAccessor
---jump to begin
---@field reset fun(self:DbAccessor):boolean
---jump to first of prefix_key
---@field jump fun(self:DbAccessor, prefixOfKey:string):boolean
---範例: for k, v in da:iter() do print(k, v) end
---@field iter fun(self:DbAccessor):(fun():string,string) --?

---@param file_name string --?
---@param dbname string
---@return LevelDb
function LevelDb(file_name, dbname)end

---@class LevelDb
---@field open fun(self:LevelDb):boolean
---禁用 earse ,update
---@field open_read_only fun(self:LevelDb):boolean
---@field close fun(self:LevelDb):boolean
---@field loaded fun(self:LevelDb):boolean
---查找 prefix key 若prefixKey潙空字串則遍歷整個庫?
---@field query fun(self:LevelDb, prefixOfKey:string):DbAccessor
---查找 value
---@field fetch fun(self:LevelDb, key:string):string|nil
---@field update fun(self:LevelDb, key:string, value:string):boolean
---@field erase fun(self:LevelDb, key:string):boolean



-- 將comit cand.type == "table" 加入 translation
-- local T={}
-- function T.func(inp, seg, env)
--   if not seg.has_tag('histroy') then return end
--   for r_iter, commit_record in context.commit_history:iter() do
--     if commit_record.type == "table" then
--        yield(Candidate(commit_record.type, seg.start, seg._end, commit_record.text, "commit_history"))
--     end
--   end
-- end
-- return T
---@class CommitHistory
---@field size number ---max_size <=20
---@field push fun(self:CommitHistory, ...):nil
---@field back fun(self: CommitHistory):CommitRecord
---@field to_table fun(self: CommitHistory):CommitRecord[]
---@field iter fun(self: CommitHistory):fun()
---@field repr fun(self: CommitHistory):string
---@field latest_text fun(self: CommitHistory):string
---@field empty fun(self: CommitHistory):boolean
---@field clear fun(self: CommitHistory)
---@field pop_back fun(self: CommitHistory):nil


function Code()end
---@class Code
---@field push fun(self:Code, inputCode:SyllableId)
---@field print fun(self:Code):string

---構造函數不受參、需手動蔿成員賦值
---如: local de = DictEntry(); de.text = '一個'; de.custom_code = 'qdt kzn '
---@return DictEntry
function DictEntry()end
---@class DictEntry
---@field text string
---@field comment string
---@field preedit string
---@field weight number
---@field commit_count number
---@field custom_code string --- 以空格分隔、字串末尾亦須潙空格
---@field remaining_code_length number
---@field code Code


---@class CommitEntry : DictEntry
---@field get fun(self:CommitEntry):DictEntry[] --官ᵗ例ᙆ推導


--env.mem = Memory(env.engine, env.engine.schema)  --  ns = "translator"
-- env.mem = Memory(env.engine, env.engine.schema, env.name_space)  
-- env.mem = Memory(env.engine, Schema("cangjie5")) --  ns = "translator-
-- env.mem = Memory(env.engine, Schema("cangjie5"), "translator") 
---@param engine Engine
---@param schema Schema
---@param name_space string|nil
---@return Memory
function Memory(engine, schema, name_space)end
---@class Memory
---@field dict_lookup fun(self:Memory, input:string, predictive:boolean, limit:number):boolean
---@field user_lookup fun(self:Memory, input:string, predictive:boolean):boolean
---当用户字典候选词被选中时触发回调。
---@field memorize fun(self:Memory, callback:fun(commitEntry:CommitEntry)) --?
---@field decode fun(self:Memory, code:Code):table<number, string>
---@field iter_dict fun(self:Memory):fun():DictEntry
---@field iter_user fun(self:Memory):fun():DictEntry
-- memory:update_userdict(dictentry, 0, "") -- do nothing to userdict
-- memory:update_userdict(dictentry, 1, "") -- update entry to userdict 使原本的c加一洏非褈賦值潙一
-- memory:update_userdict(dictentry, -1, "") -- delete entry to userdict
--- prefix會拼在custom_code之前
---@field update_userdict fun(self:Memory, entry:DictEntry, commits:number, prefix:string):boolean


---@param memory Memory
---@param type string
---@param start number
---@param end_ number
---@param dictEntry DictEntry
---@return Phrase
function Phrase(memory, type, start, end_, dictEntry)end
---@class Phrase
---@field language string
---@field type string
---@field start number
---@field _start number
---@field _end number
---@field quality number
---@field text string
---@field comment string
---@field preedit string
---@field weight number
---@field code Code
---@field entry DictEntry
---@field toCandidate fun(self:Phrase):Candidate


---@param fileName string
---@return Opencc
function Opencc(fileName)end
---@class Opencc
---@field convert fun(self:Opencc, str:string):string
---@field convert_word fun(self:Opencc, str:string):string[] ---傳入單字旹 如 发->["發","髮"]

rime_api = rime_api ---@type Rime_api
---@class Rime_api
---@field get_rime_version fun():string	librime 版本
---@field get_shared_data_dir fun():string	程序目录\data
---@field get_user_data_dir fun():string	用户目录
---@field get_sync_dir fun():string	用户资料同步目录
---@field get_distribution_name fun():string	如：“小狼毫”
---@field get_distribution_code_name fun():string	如：“Weasel”
---@field get_distribution_version fun():string	发布版本号
---@field get_user_id fun()
---@field regex_match fun(str:string, pattern:string):boolean
---@field regex_search fun()
---@field regex_replace fun(str:string, pattern:string, replacement:string):string

---@class Menu
---@field add_translation fun(self:Menu, translation:Translation)
---@field prepare fun(self:Menu, num:number)
---@field get_candidate_at fun(self:Menu, index:integer):Candidate
---@field candidate_count fun(self:Menu):integer
---@field empty fun(self:Menu):boolean



--[[ 
lua 尚無㕥叶此:
type myFn<T> = (a:number, b:string)=>T
type fn1 = myFn<number>
type fn2 = myFn<string>

let fn:fn1 = function(a,b){
	return 1
}
 ]]


end -- if false
