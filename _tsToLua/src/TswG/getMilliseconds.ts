/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
*/

// //const libPath = rime_api.get_user_data_dir()+'/lua/_lib/libTswG.dll'
// const libPath = `D:\\Program Files\\Rime\\User_Data\\lua\\_lib\\libTswG.dll`
// export const clib = package_.loadlib(libPath, '*') //getMilliseconds
// Wat(libPath)
// Wat(clib)//{"clib":true}


//const libPath = rime_api.get_user_data_dir()+'/lua/_lib/libTswG.dll'
const libPath = `D:\\Program Files\\Rime\\User_Data\\lua\\_lib\\libTswG.dll`
export const clib = package_.loadlib(libPath, 'luaopen_libTswG')
// Wat(libPath)
// Wat(clib)//[]
// Wat(clib())
// Wat(clib().getMilliseconds())

