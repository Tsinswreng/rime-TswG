
// 創ʹ日期潙空者、可按24年5月1號

import * as Module from '@/module'
import * as CntDb from '@/KVDb'
import { LevelDbPool } from '@/LevelDbPool'
const ldbPool = LevelDbPool.getInst()
class Opt{
	ldbName = 'commitHistory'
	ldbPath = rime_api.get_user_data_dir()+'/'+this.ldbName+'.ldb'
}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'commitHistoryLdb'
	}
	get pathNames(): any {
		return ''
	}
	protected _opt = new Opt()
	protected _env: Env

	protected _ldb:LevelDb
	get ldb(){return this._ldb}

	protected _cntTimeDb:CntDb.Cnt__Time_Ldb 
	get cntTimeDb(){return this._cntTimeDb}

	protected _commitConne:Connection
	get commitConne(){return this._commitConne}

	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._ldb = ldbPool.connectByName(z.opt.ldbName, z.opt.ldbPath)
		z._cntTimeDb = CntDb.Cnt__Time_Ldb.new(z._ldb)
		const ctx = env.engine.context
		z._commitConne = ctx.commit_notifier.connect(z.on_commitFn(ctx, z))
	}

	getCommit(ctx:Context){
		let ct = ctx.get_commit_text()
		const preed = ctx.get_preedit()
		const sele = ctx.get_selected_candidate()
		if(sele != void 0){
			const genu = sele.get_genuine()
			ct = genu.text
		}
		return ct
	}

	on_commitFn(this:void, ctx:Context, self:Mod){
		const z = self
		return function(this:void, ctx:Context){
			const ct = z.getCommit(ctx)
			z.update(ct)
		}
	}

	update(key:str){
		const z = this
		z.cntTimeDb.update(key)
	}

	printAll(){
		const z = this
		const dba = z.ldb.query('')
		log.warning('<ldb>')
		for(const [k,v] of dba.iter()){
			log.error(k+'\t'+v)
		}
		log.warning('</ldb>')
	}
}

export const mod = new Mod()

//let ffff = ((a,b)=>{})()

//日照香爐生紫煙遙看瀑布掛前川飛流直下三千里疑是銀河落九天日照日照
const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor{
	override init(this: void, env: Env): void {
		mod._init(env)
		//mod.printAll()
	}

	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		// const ctx = env.engine.context
		// Wat(ctx.get_script_text())//t
		// log.error(ctx.get_preedit().text)
		return pr.kNoop
	}
}

export const processor = new Processor()