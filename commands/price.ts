import {Command, Commands} from "./command";
import {Message} from "discord.js";
import {PriceHistoryService} from "../services/priceHistoryService";
import {PriceHistory} from "../models/priceHistory";
import getPriceHistory = PriceHistoryService.getPriceHistory;
import {TimeService} from "../services/timeService";
import savePriceHistory = PriceHistoryService.savePriceHistory;

@Commands.register("price")
export class Price implements Command {
	public async execute(message: Message, args: string[]) {
		let newPrice = parseInt(args[0])
		if (isNaN(newPrice)) {
			message.channel.send("Please enter a valid price, silly goose");
			return
		}

		let targetUserName: string;
		let targetUserId: string;
		if (message.mentions.members.size) {
			let targetUser = message.mentions.members.first().user;
			targetUserName = targetUser.username;
			targetUserId = targetUser.id
		} else if (args[args.length - 1].startsWith("@")) {
			targetUserName = args[args.length - 1];
			targetUserId = args[args.length - 1];
		} else {
			targetUserName = message.author.username
			targetUserId = message.author.id
		}

		let priceHistory: PriceHistory = await getPriceHistory(targetUserId);

		let time: number = TimeService.getCurrentTime();
		priceHistory.prices[time] = newPrice
		await savePriceHistory(targetUserId, priceHistory);
		message.channel.send(`price history for ${targetUserName} is ${priceHistory.prices}. Prediction: ${priceHistory.getProphetLink()}`);

	}
}
