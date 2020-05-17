import {Command, Commands} from "./command";
import {Message} from "discord.js";
import commandList = Commands.commandList;
import commandMap = Commands.commandMap;

@Commands.register("help")
export class Help implements Command {
	public execute(message: Message, args: string[]) {
		let helpMessage = "Your friendly neighborhood turnip-pot. Code on GitHub: <https://github.com/jsettlem/turnip-pot>\n";
		for (let command of commandList) {
			helpMessage += `__**${command}:**__\n`;
			helpMessage += commandMap[command].getHelp() + "\n";
		}

		message.channel.send(helpMessage);
	}

	getHelp(): string {
		return "`!help`: shows this help message";
	}
}
