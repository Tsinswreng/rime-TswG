export class WordDbRow{
	protected constructor(
		public table:string //數據庫中本無此字段、㕥存表名。
		,public wordShape:string
		//,public variant:string
		,public pronounce:string
		,public mean:string
		,public annotation:string //
		,public tag:string
		,public times_add:number|string
		,public dates_add:string
		,public times_rmb:number|string
		,public dates_rmb:string
		,public times_fgt:number|string
		,public dates_fgt:string
		,public source:string
		,public id?:number|string //從數據庫中取數據時id必不潙空
	){}
}