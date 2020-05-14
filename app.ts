import {Client, Message} from "discord.js";
import * as secret from "./secret.json"
import {prefix} from "./config.json";
import {Commands} from "./commands/command";
import commandMap = Commands.commandMap;

const client: Client = new Client();

function processMessage(message: Message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command in commandMap) {
		commandMap[command].execute(message, args);
	}
}

client.once('ready', () => {
	client.user.setActivity("the stalk market", {type: "PLAYING"});
	console.log("ready!");
})

client.on('message', processMessage)
client.on('messageUpdate', (oldMessage, newMessage) => {
	if (newMessage instanceof Message) {
		processMessage(newMessage)
	}
});

client.login(secret.token)
