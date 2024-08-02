import * as Module from '@/module'

class Mod extends Module.ModuleStuff{


	get name(): string {
		throw new Error('Method not implemented.');
	}
	get pathNames(): any {
		throw new Error('Method not implemented.');
	}
	protected _opt ={}
	get opt(){
		return this._opt
	}
	protected _env: Env;

}

const mod = new Mod()

class Segmentor extends Module.RimeSegmentor{

}

