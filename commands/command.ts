import {Message} from "discord.js";

export interface Command {
	execute(message: Message, args: string[])
}

export namespace Commands {
	type Constructor<T> = {
		new(...args: any[]): T;
		readonly prototype: T;
	}

	export let commandMap: { [keyword: string]: Command } = {};

	export function register(keyword: string) {
		return function <T extends Constructor<Command>>(constructor: T) {
			commandMap[keyword] = new constructor();
		}
	}

}

export * from './help'
export * from './price'
