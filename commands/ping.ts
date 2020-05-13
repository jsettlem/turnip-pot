import {Command, Commands} from "./command";
import {Message} from "discord.js";

@Commands.register("ping")
export class Ping implements Command {
	public execute(message: Message, args: string[]): Promise<Message> | void {
		message.channel.send("pong.")
	}
}
