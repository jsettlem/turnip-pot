import {Command, Commands} from "./command";
import {Message} from "discord.js";
import {PriceHistoryService} from "../services/priceHistoryService";
import {PriceHistory} from "../models/priceHistory";
import {TimeService} from "../services/timeService";
import getAllPriceHistories = PriceHistoryService.getAllPriceHistories;
import longTimeNames = PriceHistoryService.longTimeNames;


@Commands.register("bug")
export class Bug implements Command {
	public async execute(message: Message, args: string[]) {
		let priceHistories: PriceHistory[] = await getAllPriceHistories(TimeService.currentWeek());
		let currentTime = TimeService.getCurrentTime();
		let priceCheckMessage = `${longTimeNames[currentTime]} price check!`;
		if (priceHistories.length === 0) {
			message.channel.send(`${priceCheckMessage} @everyone`)
		} else {
			message.channel.send(`${priceCheckMessage} ${priceHistories
				.filter(h => h.prices[currentTime] === 0 && !h.userId.startsWith("@"))
				.map(h => "<@" + h.userId + ">!")
				.join(" ")}`
			)
		}
	}

	getHelp(): string {
		return "`!bug`: bugs everyone who hasn't entered their prices yet\n"
	}
}
