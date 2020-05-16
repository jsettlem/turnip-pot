import {TimeService} from "./timeService";
import * as mongoose from "mongoose";

import * as config from "../config.json"
import {Snowflake} from "discord.js";

import {PriceHistory} from "../models/priceHistory";
import {getModelForClass} from "@typegoose/typegoose";


export namespace PriceHistoryService {

	export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	export const timeNames = [dayNames[0].substr(0, 2)]
		.concat(...dayNames.slice(1).map(d => [d.substr(0, 2) + " AM", d.substr(0, 2) + " PM"]));

	mongoose.connect(config.db);

	let priceHistoryModel = getModelForClass(PriceHistory);

	export async function getPriceHistory(userId: Snowflake, userName: string): Promise<PriceHistory> {
		let history = await priceHistoryModel.findOne({userId: userId});
		if (!history) {
			return new PriceHistory({
				userName: userName,
				userId: userId,
				currentWeek: TimeService.currentWeek(),
				previousPattern: undefined,
				prices: Array<number>(13).fill(0),
				predictions: [0, 0, 0, 0]
			});
		}
		history.updateWeek();
		return history;
	}

	export async function savePriceHistory(priceHistory: PriceHistory) {
		await priceHistoryModel.findOneAndUpdate({userId: priceHistory.userId}, priceHistory, {upsert: true}).then();
	}
}
