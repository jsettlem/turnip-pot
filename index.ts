import {Client} from "discord.js";
import * as secret from "./secret.json"
import {prefix} from "./config.json";

const client: Client = new Client();

client.once('ready', () => {
	console.log("ready!");
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		message.channel.send(`username: ${message.author.username}, snowflake: ${message.author.id}, mentions: ${JSON.stringify(message.mentions.users)}`);
	}
})

client.login(secret.token)
