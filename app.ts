import {Client, Message} from "discord.js";
import {prefixes} from "./config.json";
import {Commands} from "./commands/command";
import commandMap = Commands.commandMap;
import commandList = Commands.commandList;
import getOptions = Commands.getOptions;

const client: Client = new Client();

function processMessage(message: Message) {
	if (!prefixes.some(p => message.content.startsWith(p)) || message.author.bot) return;

	const args = message.content.slice(1).split(/ +/);
	const command = args.shift().toLowerCase();

	let possibleCommands = commandList.filter(c => c.startsWith(command.toLowerCase()));
	if (possibleCommands.length === 1) {
		commandMap[possibleCommands[0]].execute(message, args);
	} else if (possibleCommands.length === 0) {
		message.channel.send(`Unknown command. Did you mean ${getOptions(commandList.map(c => prefixes[0] + c))}`);
	} else {
		message.channel.send(`Did you mean ${getOptions(possibleCommands.map(c => prefixes[0] + c))}`)
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

console.log(process.env.DISCORD_TOKEN)
client.login(process.env.DISCORD_TOKEN)
