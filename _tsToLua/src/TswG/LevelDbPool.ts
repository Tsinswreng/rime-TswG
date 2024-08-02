export class LevelDbPool{
	protected constructor(){}
	protected static new(){
		return new this()
	}

	protected static _instance:LevelDbPool
	static getInst(){
		if(this._instance == void 0){
			this._instance = this.new()
		}
		return this._instance
	}

	protected _name__db:Map<string, LevelDb> = new Map()

	connectByName(dbName:string, dbPath?:string){
		const z = this
		const db = z._name__db.get(dbName)
		if(db != void 0){
			return db
		}
		if(dbPath == void 0){
			throw new Error(`no db or dbPath`)
		}
		const db_ = LevelDb(dbPath, dbName)
		db_.open()
		z._name__db.set(dbName, db_)
		return db_
	}
}