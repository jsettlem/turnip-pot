import {Command, Commands} from "./command";
import {Message} from "discord.js";

@Commands.register("pong")
export class Pong implements Command {
	public execute(message: Message, args: string[]): Promise<Message> | void {
		message.channel.send("ping.")
	}
}
