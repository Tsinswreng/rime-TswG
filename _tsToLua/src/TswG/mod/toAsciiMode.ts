import * as Module from '@/module'


const pr = Module.ProcessResult
class Processor extends Module.RimeProcessor {
	override func(this: void, key: KeyEvent, env: Env): Module.ProcessResult {
		const ctx = env.engine.context
		const repr = key.repr()
		// Wat(repr)
		// if(repr === 'Shift+space'){
		// 	log.error('toAsciiMode: Shift+Release+Alt_L')
		// 	ctx.set_option('ascii_mode', true)
		// 	return pr.kAccepted
		// }
		return pr.kNoop
	}
}

export const processor = new Processor()