
export interface LibTswG{
	getMilliseconds(this:void):integer
	setTimeout(this:void, callback:()=>void, ms:number):integer
	setInterval(this:void, callback:()=>void, ms:number):integer
	clearTimeout(this:void, id:integer)
	clearInterval(this:void, id:integer)
}

const libPath = rime_api.get_user_data_dir()+'/lua/_lib/libTswG.dll'
export const libTswG:undefined|(()=>LibTswG|undefined) = package_.loadlib(libPath, 'luaopen_libTswG')


