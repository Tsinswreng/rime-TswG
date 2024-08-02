
import * as Module from '@/module'
import { LevelDbPool } from '@/LevelDbPool'
const dbPool = LevelDbPool.getInst()
class Opt{
	ldbName = 'committed'
	ldbPath = rime_api.get_user_data_dir()+'/'+this.ldbName
	delimiter = '\t'
}

class Mod extends Module.ModuleStuff{
	get name(): string {
		return 'saveCommit'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.');
	}
	protected _opt = new Opt()
	get opt(){
		return this._opt
	}
	protected _env: Env;

	override _init(env: Env): void {
		const z = this
		super._init(env)
		z._ldb = dbPool.connectByName(z._opt.ldbName, z._opt.ldbPath)
	}
	
	protected _ldb:LevelDb
	get ldb(){return this._ldb}
}

export const mod = new Mod()

class Processor extends Module.RimeProcessor{
	init(this: void, env: Env): void {
		mod._init(env)
	}
}