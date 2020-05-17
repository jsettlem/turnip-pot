import {Message} from "discord.js";

export interface Command {
	execute(message: Message, args: string[]);
	getHelp(): string;
}

export namespace Commands {
	type Constructor<T> = {
		new(...args: any[]): T;
		readonly prototype: T;
	}

	export let commandMap: { [keyword: string]: Command } = {};
	export let commandList = [];

	export function register(keyword: string) {
		return function <T extends Constructor<Command>>(constructor: T) {
			commandMap[keyword] = new constructor();
			commandList.push(keyword);
		}
	}

	export function getOptions(validArgs: string[]) {
		return validArgs.map(a => a + "?").join(" or ");
	}

}

export * from './help'
export * from './price'
export * from './get'
