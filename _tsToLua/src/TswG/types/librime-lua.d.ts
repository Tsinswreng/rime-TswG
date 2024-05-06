/* 
 * TsinswrengGwāng <tsinswreng@qq.com>
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/
interface Env{
	engine:Engine
	name_space:string
}
//declare var env:Env

interface Connection{
	disconnect(this:Connection)
}

interface Notifier{
	connect(this:Notifier, func:(ctx:Context)=>any, grup?: integer):Connection
}

interface Preedit{
	text:string// --- 似 在segmentor.func中印此則無delimiter、肰在即將上屏旹印㞢則有
	caret_pos:integer
	sel_start:integer
	sel_end:integer
}



interface Segmentation{ //extends vector<Segment>
	/** 脱字符之前之字串、異於context.input */
	input:string
	empty(this:Segmentation):boolean
	back(this:Segmentation):Segment|undefined
	pop_back(this:Segmentation):undefined
	reset_length(this:Segmentation, size_t:number) //保留 n 個 Segment
	//---新增 一個 kVoid 的 Segment(start_pos = 前一個 end_pos , end_pos = start_pos)
	add_segment(this:Segmentation, seg:Segment)
	forward(this:Segmentation):boolean
	trim(this:Segmentation):nil
	has_finished_segmentation(this:Segmentation):boolean
	get_current_start_position(this:Segmentation):number
	get_current_end_position(this:Segmentation):number
	get_current_segment_length(this:Segmentation):number

	/**
	 * ---属性 input 中已经确认（处理完）的长度
	 * ---（通过判断 status 为 kSelected 或 kConfirmed 的 Segment 的 _end 来判断 confirmed_position）
	 * ---https://github.com/rime/librime/.../src/segmentation.cc#L127
	 * @param this 
	 */
	get_confirmed_position(this:Segmentation):number
}

interface Composition{
	empty(this:Composition):boolean //---尚未开始编写（无输入字符串、无候选词）
	back(this:Composition):Segment|undefined //---获得队尾（input字符串最右侧）的 Segment 对象
	pop_back(this:Composition):nil //---去掉队尾的 Segment 对象
	push_back(this:Composition, e:Segment):nil //---	在队尾添加一个 Segment对象
	has_finished_composition(this:Composition):boolean //--?
	//---获得队尾的 Segment 的 prompt 字符串（prompt 为显示在 caret 右侧的提示，比如菜单、预览输入结果等）
	get_prompt(this:Composition):string
	toSegmentation(this:Composition):Segmentation //--?
}

interface OptionUpdateNotifier{}

interface PropertyUpdateNotifier{}

interface KeyEventNotifier{}

interface Context{
	composition :Composition
	input: string
	caret_pos: integer
	commit_notifier :Notifier
	/** 在其回調中取不到selected_candidate 與 context.input */
	select_notifier :Notifier
	update_notifier :Notifier
	delete_notifier :Notifier
	option_update_notifier :OptionUpdateNotifier
	property_update_notifier :PropertyUpdateNotifier
	unhandled_key_notifier :KeyEventNotifier
	/** 上屏選中ᵗ候選詞、不觸發select? */
	commit(this:Context)
	/** --- 已選中ᵗ項(高亮) */
	get_commit_text():string
	get_script_text():string //-- 按音节分割
	get_preedit():Preedit
	/** -- 是否正在输入（输入字符串非空或候选词菜单非空） */
	is_composing()
	/** -- 是否有候选词（选项菜单） 只有input而無候選旹亦返false */
	has_menu():boolean
	get_selected_candidate():Candidate|undefined
	push_input(text:string)
	pop_input(num:integer)
	delete_input()
	clear()
	select(index:integer):boolean
	confirm_current_selection()
	delete_current_selection()
	confirm_previous_selection()
	reopen_previous_selection()
	clear_previous_segment()
	reopen_previous_segment()
	clear_non_confirmed_composition()
	refresh_non_confirmed_composition()
	set_option(this:Context, option:string, state:boolean)
	get_option(this:Context, option:string):boolean
	set_property()
	get_property()
	clear_transient_options()

}

interface Engine{
	schema	:Schema
	context	:Context
	active_engine	:any
	process_key(this: Engine, keyEvent:KeyEvent)
	compose(this: Engine): Candidate[]
	commit_text(this: Engine, text: string) //-- 上屏 text 字符串
	apply_schema(this: Engine)//-- apply_schema 方法接受 Engine 类型的 self 参数
}


type ConfigType = 'kNull'|'kScalar'|'kList'|'kMap'

interface ConfigList{
	size:integer
	type: ConfigType
	element:ConfigItem

	get_at(this:ConfigList, index:integer):ConfigItem//越界旹返undefined?
	get_value_at(this:ConfigList, index:integer):ConfigValue
	set_at(this:ConfigList)
	append(this:ConfigList)
	insert(this:ConfigList)
	clear(this:ConfigList):unknown
	empty(this:ConfigList):boolean
	resize(this:ConfigList)
}
interface ConfigItem{
	type: ConfigType
	empty:boolean
	/** 当 type == "kScalar" 时使用 */
	get_value(this:ConfigItem):ConfigValue|undefined
	/** 当 type == "kList" 时使用 */
	get_list(this:ConfigItem):ConfigList|undefined
	/** 当 type == "kMap" 时使用 */
	get_map(this:ConfigItem):ConfigMap|undefined
}



interface ConfigMap{
	size:integer
	/** 如 'kMap' */
	type:ConfigType
	element:ConfigItem
	
	set(this:ConfigMap)
	get(this:ConfigMap, key:string):ConfigItem
	get_value(this:ConfigMap, key:string):ConfigValue
	has_key(this:ConfigMap, key:string):boolean
	clear(this:ConfigMap):unknown
	empty(this:ConfigMap):boolean
	keys(this:ConfigMap):string[]
}
interface ConfigValue extends ConfigItem{
	value:string
	type: ConfigType
	element: ConfigItem

	/**
	 * bool是int子集，所以也可以用get_int来取得bool值
	 */
	get_bool(this:ConfigValue):boolean|undefined
	get_int(this:ConfigValue):integer|undefined
	get_double(this:ConfigValue):number|undefined
	set_bool(this:ConfigValue)
	set_int(this:ConfigValue)
	set_double(this:ConfigValue)
	get_string(this:ConfigValue):string|undefined
	set_string(this:ConfigValue)

}


/** --- 配置对象，可以通过 env.engine.schema.config 获得 */
interface Config{
	load_from_file()
	save_to_file()
	
	is_null(this:Config, conf_path:string):boolean
	is_value(this:Config, conf_path:string):boolean
	is_list(this:Config, conf_path:string):boolean
	is_map(this:Config, conf_path:string):boolean
	get_bool(this:Config, conf_path:string):boolean
	get_int(this:Config, conf_path:string):integer
	get_double(this:Config, conf_path:string):number
	get_string(this:Config, conf_path:string):string
	set_bool(this:Config, conf_path:string, v:boolean):unknown
	set_int(this:Config, conf_path:string, v:integer):unknown
	set_double(this:Config, conf_path:string, v:number):unknown
	set_string(this:Config, conf_path:string, str:string):unknown
	get_item(this:Config, path:string):ConfigItem|undefined
	set_item(this:Config, path:string, item:ConfigItem)

	get_list(this:Config, conf_path:string):ConfigList|undefined
	set_list()
	get_map(this:Config, conf_path:string):ConfigMap|undefined
	set_map()
	set_value(this:Config, conf_path:string, value:ConfigValue):unknown
	get_list_size()//(this:Config, conf_path:string):

}


interface Schema{
	schema_id :string
	schema_name :string
	config :Config
	page_size :integer
	select_keys :string //--?
}

interface Candidate{
	type	:'user_phrase'|'phrase'|'punct'|'simplified'|'completion'
	start	:number
	_start	:number
	_end	:number
	quality	:number
	text	:string
	comment	:string
	preedit	:string
	get_dynamic_type	(this:Candidate):string
	get_genuine	(this:Candidate):Candidate
	get_genuines	(this:Candidate)
	to_shadow_candidate	(this:Candidate)
	to_uniquified_candidate	()
	append	()
}

interface ShadowCandidate extends Candidate{

}

interface Translation{
	iter(this:Translation):LuaIterable<Candidate>
}


/**
 * @customName Set 
 * set_['hiragana'] = true 不效
 */
interface Set_{
	//@ts-ignore
	empty(this:Set_):boolean
	//@ts-ignore
	__index(this:Set_)
	
	/**
	 * set_ + {'hiragana':true}
	 * @param this 
	 *///@ts-ignore	
	__add(this:Set_)
	//@ts-ignore
	__sub(this:Set_)
	//@ts-ignore
	__mul(this:Set_)
	//@ts-ignore
	__set(this:Set_)
	[key:Exclude<string, 'empty'|'__index'>]: boolean
}

declare namespace Set_{
	var add:LuaAddition<Set_, object, Set_>
	//var sub
	//...
}


interface Menu{
	add_translation(this:Menu, translation:Translation)
	prepare(this:Menu, num:number)
	get_candidate_at(this:Menu, index:integer):Candidate
	candidate_count(this:Menu):integer
	empty(this:Menu):boolean
}


type SegmentStatus = 'kVoid'|'kGuess'|'kSelected'|'kConfirmed'

interface Segment{
	status:SegmentStatus
	start:integer
	_start:integer
	//end:integer
	_end:integer
	length:integer
	/**  {"nonKanji":true,"abc":true} */
	tags: Set_
	menu:Menu
	/**
	 * -- 获得队尾的 Segment 对象
	 * local segment = composition:back()
	 * -- 获得选中的候选词序号
	 * local selected_candidate_index = segment.selected_index
	 */
	selected_index: integer
	prompt:string
	/** 把status 設潙kVoid */
	clear(this:Segment):nil
	close(this:Segment):nil
	reopen(this:Segment, index:integer):nil
	has_tag(this:Segment, tag:string):boolean
	/**
	 * 
an<Candidate> Segment::GetCandidateAt(size_t index) const {
  if (!menu)
    return nullptr;
  return menu->GetCandidateAt(index);
}
	*/
	get_candidate_at(this:Segment, index:number):Candidate // index 始自零
	get_selected_candidate(this:Segment):Candidate
	
}


type KeyEventRepr = string|'BackSpace'
interface KeyEvent{
	keycode:integer
	modifier:integer
	shift(this:KeyEvent):boolean
	ctrl(this:KeyEvent):boolean
	alt(this:KeyEvent):boolean
	super(this:KeyEvent):boolean
	release(this:KeyEvent):boolean
	caps(this:KeyEvent):boolean
	repr(this:KeyEvent):KeyEventRepr
	eq:unknown
}

interface Log{
	info	(this:void, v:string):void
	warning	(this:void, v:string):void
	error	(this:void, v:string):void
}

interface ReverseDb{
	lookup(this:ReverseDb, text:string):string
}

interface ReverseLookup{
	lookup(key:string):string
	lookup_stems()
}



interface LevelDb{

}

interface DictEntry{
	text:string
	comment:string
	preedit:string
	weight: number
	commit_count: integer
	custom_code:string
	remaining_code_length:number
	code:Code
}

interface CommitEntry extends DictEntry{

}


interface Code{

}

interface Opencc{
	convert(this:Opencc, str:string):string
	/** ---傳入單字旹 如 发->["發","髮"] */
	convert_word(this:Opencc, str:string):string[]
}

interface Memory{
	dict_lookup(this:Memory, input:string, predictive:boolean, limit:number):boolean
	user_lookup(this:Memory, input:string, predictive:boolean):boolean
	memorize(this:Memory, callback:(this:void, commitEntry:CommitEntry)=>any)
	decode (this:Memory, code:Code):LuaTable<number, string>
	//iter_dict(this:Memory):()=>LuaIterable<DictEntry>
	//iter_user(this:Memory):()=>LuaIterable<DictEntry>
	iter_dict(this:Memory):LuaIterable<DictEntry>
	iter_user(this:Memory):LuaIterable<DictEntry>
	update_userdict(this:Memory, entry:DictEntry, commits:number, prefix:string):boolean
}

interface Rime_api{
	get_rime_version		(this:void):string
	get_shared_data_dir		(this:void):string
	get_user_data_dir		(this:void):string
	get_sync_dir		(this:void):string
	get_distribution_name		(this:void):string
	get_distribution_code_name		(this:void):string
	get_distribution_version		(this:void):string
	get_user_id		(this:void):string
	regex_match		(this:void, str:string, pattern:string):boolean
	regex_search		(this:void, str:string, pattern:string):unknown
	regex_replace		(this:void, str:string, pattern:string, replacement:string):string
}

declare var rime_api:Rime_api
declare var log:Log

declare var Candidate: (
	this:void
	,type:string
	,_start:integer
	,_end:integer
	,text:string
	,comment:string
)=> Candidate


declare function KeyEvent(this:void, repr:string):KeyEvent
declare function ReverseDb(this:void, file_name:string):ReverseDb
declare function ReverseLookup(this:void, name:string):ReverseLookup
declare function DictEntry(this:void):DictEntry
declare function Memory(this:void, engine:Engine, schema:Schema, name_space?:string):Memory
declare function Opencc(this:void, fileName:string):Opencc
declare function ShadowCandidate(this:void, cand:Candidate, type:string, text:string, comment:string, inherit_comment?:string):ShadowCandidate
declare function Schema(this:void, schema_id:string):Schema
declare function Segment(this:void, start_pos:integer, end_pos:integer):Segment

/** 
 * @customName Set 
 * local set_tab = Set({'a','b','c','c'}) # set_tab = {a=true,b=true, c=true}.
 */
declare function Set_(this:void, table:object):Set_
/** @customName yield */
declare function yield_(this:void, candidate:Candidate):void

/**
 * 
 * @param this 
 * @param str str: 值（可通过 get_string 获得）
 */
declare function ConfigValue(this:void, str:string):ConfigValue
//在我的嵌入式js環境中(不是瀏覽器環境也不是node環境) 有一個全局變量、既可以通過log訪問 也可以通過_ENV.log訪問。請問我該如何爲他寫.d.ts的類型聲明?



