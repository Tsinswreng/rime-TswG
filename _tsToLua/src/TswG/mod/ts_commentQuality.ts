/**
 * Copyright (c) 2024 TsinswrengGwāng <tsinswreng@qq.com>
 * This code is licensed under MIT License.
 * https://github.com/Tsinswreng/rime-TswG
 * 
 */

import * as Module from '@/module'
import { SwitchMaker, cmdMod as cmdMod } from './cmd/ts_cmd'



class Opt{
	static new(){
		const o = new this()
		return o
	}
	switchName = 'commentQuality'
}

class Mod extends Module.ModuleStuff{
	static new(){
		const o = new this()
		return o
	}
	get name(): string {
		return 'commentQuality'
	}
	get pathNames(): any {
		throw new Error('Method not implemented.');
	}
	protected _opt = Opt.new()
	get opt(){return this._opt}

	protected _env: Env;

	override _init(env: Env): void {
		super._init(env)
		CommentQualitySwitch.new().register(cmdMod)
	}
	
	isOn(ctx:Context){
		const z = this
		return ctx.get_option(z.opt.switchName)
	}
}
export const mod = Mod.new()

class CommentQualitySwitch extends SwitchMaker{
	_cmd_off__on: [string, string] = ['Q', 'q']
	_switchNames_on: string[] = [mod.opt.switchName]
}


class Filter extends Module.RimeFilter{
	static new(){
		const o = new this()
		return o
	}
	override init(this: void, env: Env): void {
		mod._init(env)
	}

	override func(this: void, translation: Translation, env: Env): void {
		const ctx = env.engine.context
		const cands = [] as Candidate[]
		for(const cand of translation.iter()){
			cands.push(cand)
		}
		if( mod.isOn(ctx) ){
			for(const cand of cands){
				cand.comment += cand.quality
			}
		}

		for(const cand of cands){
			yield_(cand)
		}

	}
}

const filter = Filter.new()

export {filter}