//@ts-check
import clipboard from 'clipboardy';
//clipboard.writeSync('🦄');
const ans = clipboard.readSync();
console.log(ans)
//=> '🦄'