import {Client} from "discord.js";
import * as secret from "./secret.json"
import {prefix} from "./config.json";
import {Commands} from "./commands/command";
import commandMap = Commands.commandMap;

const client: Client = new Client();

client.once('ready', () => {
	client.user.setActivity("the stalk market", {type: "PLAYING"});
	console.log("ready!");
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command in commandMap) {
		commandMap[command].execute(message, args);
	}
})

client.login(secret.token)
