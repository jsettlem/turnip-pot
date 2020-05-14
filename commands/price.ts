import {Command, Commands} from "./command";
import {Message, User} from "discord.js";
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

		let user: User;
		if (message.mentions.members.size) {
			user = message.mentions.members.first().user;
		} else {
			user = message.author
		}

		let priceHistory: PriceHistory = await getPriceHistory(user.id);
		if (!priceHistory) {
			priceHistory = new PriceHistory(
				TimeService.currentWeek(),
				undefined,
				Array<number>(13).fill(0)
			)
		}

		let time: number = TimeService.getCurrentTime();
		priceHistory.prices[time] = newPrice
		await savePriceHistory(user.id, priceHistory);
		message.channel.send(`price history for ${user.username} is ${priceHistory.prices}. Prediction: ${priceHistory.getProphetLink()}`);

	}
}
