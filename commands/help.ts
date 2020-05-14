import {Command, Commands} from "./command";
import {Message} from "discord.js";

@Commands.register("help")
export class Help implements Command {
	public execute(message: Message, args: string[]) {
		message.channel.send("invalid command")
	}
}
