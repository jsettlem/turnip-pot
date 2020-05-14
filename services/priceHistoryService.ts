const keyv = require('keyv');
import {Snowflake} from "discord.js";
import {PriceHistory} from "../models/priceHistory";

export namespace PriceHistoryService {
	const users = new keyv();

	export async function getPriceHistory(userId: Snowflake): Promise<PriceHistory> {
		let history: object = await users.get(userId);
		if (history !== undefined) {
			return new PriceHistory(history["currentWeek"], history["previousPattern"], history["prices"])
		}
		return undefined

	}

	export function savePriceHistory(userId: Snowflake, priceHistory: PriceHistory): Promise<PriceHistory> {
		return users.set(userId, priceHistory)
	}

	users.set('foo', 'user');
}
