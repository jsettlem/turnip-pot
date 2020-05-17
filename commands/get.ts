import {Command, Commands} from "./command";
import {Message} from "discord.js";
import {PriceHistoryService} from "../services/priceHistoryService";
import {patternList, PriceHistory} from "../models/priceHistory";
import {TimeService} from "../services/timeService";
import getAllPriceHistories = PriceHistoryService.getAllPriceHistories;
import getOptions = Commands.getOptions;
import * as AsciiTable from 'ascii-table';
import timeNames = PriceHistoryService.timeNames;



@Commands.register("get")
export class Get implements Command {
	public async execute(message: Message, args: string[]) {
		let validArgs = ["prices", "predictions"]
		let targetArgs = validArgs.filter(a => a.startsWith(args[0]?.toLowerCase()))

		if (targetArgs.length === 0) {
			message.channel.send(`Did you want to get ${getOptions(validArgs)}`);
		} else if (targetArgs.length > 1) {
			message.channel.send(`Did you mean ${getOptions(targetArgs)}`);
		} else {
			let priceHistories: PriceHistory[] = await getAllPriceHistories(TimeService.currentWeek());
			let currentWeek = TimeService.currentWeek();
			if (targetArgs[0] === "prices") {
				let table = new AsciiTable(`Prices for year ${currentWeek.year}, week ${currentWeek.week}`);
				table.setHeading("User", "previous", ...timeNames);
				for (let history of priceHistories) {
					table.addRow(history.userName, history.previousPattern ?? "unknown", ...history.prices.map(PriceHistoryService.priceToString));
				}
				message.channel.send("```\n" + table.toString() + "```");
			} else {
				let chances_none = [1, 1, 1, 1, 1, 1]
				let chances_all = [1, 1, 1, 1, 1, 1]
				let table = new AsciiTable(`Predictions for year ${currentWeek.year}, week ${currentWeek.week}`);
				table.setHeading("User", ...patternList, "large ∨ small", "dec ∨ fluc");
				let formatPercent = p => (p * 100).toFixed(2) + "%";
				for (let history of priceHistories) {
					let predictions = [...history.predictions,
						history.predictions[1] + history.predictions[3],
						history.predictions[0] + history.predictions[2]
					]
					table.addRow(history.userName, ...predictions.map(formatPercent));
					chances_none = chances_none.map((c, i) => (1 - predictions[i]) * c);
					chances_all = chances_all.map((c, i) => predictions[i] * c);
				}
				table.addRow();
				table.addRow("Total - All", ...chances_all.map(formatPercent));
				table.addRow("Total - Any", ...chances_none.map(c => formatPercent(1 - c)));
				table.addRow("Total - None", ...chances_none.map(formatPercent));
				message.channel.send("```\n" + table.toString() + "```");
			}
		}
	}
}
