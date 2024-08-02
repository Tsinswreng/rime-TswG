// const libPath = rime_api.get_user_data_dir()+'/lua/_lib/libTswG.dll'

// export const libTswG:undefined|(()=>LibTswG|undefined) = package_.loadlib(libPath, 'luaopen_libTswG')


export interface WinClipboard{
	get(this:void):string
	set(this:void, str:string):boolean
}

const libPath = rime_api.get_user_data_dir()+'/lua/_lib/winClipboard.dll'
const winClipboard:undefined|(()=>WinClipboard|undefined) = package_.loadlib(libPath, 'luaopen_winClipboard')
export {winClipboard}


