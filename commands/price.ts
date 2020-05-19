import {Command, Commands} from "./command";
import {Message} from "discord.js";
import {PriceHistoryService} from "../services/priceHistoryService";
import {Pattern, patternList, PriceHistory} from "../models/priceHistory";
import getPriceHistory = PriceHistoryService.getPriceHistory;
import {TimeService} from "../services/timeService";
import savePriceHistory = PriceHistoryService.savePriceHistory;
import dayNames = PriceHistoryService.dayNames;
import getOptions = Commands.getOptions;
import longTimeNames = PriceHistoryService.longTimeNames;

@Commands.register("price")
export class Price implements Command {
	public async execute(message: Message, args: string[]) {

		let currentArg = 0
		let newPattern: Pattern | undefined;
		let newPrice = parseInt(args[currentArg])
		let settingPattern: boolean = false;
		let settingPrice: boolean = false;

		if (!isNaN(newPrice)) {
			currentArg++;
			settingPrice = true;
		} else {
			const lowerCasePattern = args[currentArg]?.toLowerCase();
			if (lowerCasePattern?.startsWith('u')) {
				currentArg++;
				newPattern = undefined;
				settingPattern = true;
			} else {
				let matchingPatterns = patternList.filter(p => p.toLowerCase().startsWith(lowerCasePattern));
				if (matchingPatterns.length === 1) {
					currentArg++;
					newPattern = matchingPatterns[0];
					settingPattern = true;
				}
			}

		}

		let targetTime: number;
		if (settingPrice) {
			let commandDay: string = args[currentArg];
			let commandTime = args[currentArg + 1];
			let matchingDays = dayNames.filter(d => d.toLowerCase().startsWith(commandDay?.toLowerCase()));
			if (matchingDays.length === 1) {
				let matchingDay = dayNames.indexOf(matchingDays[0]);
				if (matchingDay === 0) {
					targetTime = 0;
				} else {
					if (commandTime?.toLowerCase()?.startsWith("a")) {
						targetTime = matchingDay * 2 - 1;
					} else {
						targetTime = matchingDay * 2;
					}
				}
				currentArg++;
				if (commandTime?.startsWith("a") || commandTime?.startsWith("p")) {
					currentArg++;
				}
			} else if (matchingDays.length > 1) {
				message.channel.send(`Did you mean ${getOptions(matchingDays)}`)
				return;
			} else {
				targetTime = TimeService.getCurrentTime()
			}
		}

		let targetUserName: string | undefined;
		let targetUserId: string | undefined;

		if (message.mentions.members?.size) {
			let targetUser = message.mentions.members.first()?.user;
			targetUserName = targetUser?.username;
			targetUserId = targetUser?.id
		} else if (args[currentArg]?.startsWith("@")) {
			targetUserName = args[currentArg];
			targetUserId = args[currentArg];
		} else {
			targetUserName = message.author.username
			targetUserId = message.author.id
		}

		let priceHistory: PriceHistory = await getPriceHistory(targetUserId, targetUserName);
		let baseMessage: string;
		if (settingPrice) {
			priceHistory.prices[targetTime] = newPrice;
			priceHistory.predict();
			await savePriceHistory(priceHistory);
			baseMessage = `Setting price for ${targetUserName} on ${longTimeNames[targetTime]} to ${newPrice}`
		} else if (settingPattern) {
			priceHistory.previousPattern = newPattern;
			priceHistory.predict();
			await savePriceHistory(priceHistory);
			baseMessage = `Setting previous pattern for ${targetUserName} to ${newPattern}`;
		} else {
			baseMessage = `Getting price history for ${targetUserName}`;
		}

		message.channel.send(`${baseMessage}\n${priceHistory.getMessage()}\n\`\`\`\n${priceHistory.getPredictionTable()}\`\`\``);
	}

	public getHelp(): string {
		return "`!price`: shows your price history for the current week\n" +
			"`!price 99`: sets your price for today (eastern time)\n" +
			"`!price 99 Monday PM`: sets your price for a specific day and time\n" +
			"`!price " + patternList.join("|") + "`: sets your previous week pattern\n" +
			"`!price @pimanrules`: runs the corresponding price command against a different user";
	}
}
