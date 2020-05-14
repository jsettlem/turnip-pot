const keyv = require('keyv');
import {Snowflake} from "discord.js";
import {PriceHistory} from "../models/priceHistory";

export namespace PriceHistoryService {
	const users = new keyv();

	export function getPriceHistory(userId: Snowflake): Promise<PriceHistory> {
		return users.get(userId);
	}

	export function savePriceHistory(userId: Snowflake, priceHistory: PriceHistory): Promise<PriceHistory> {
		return users.set(userId, priceHistory)
	}

	users.set('foo', 'user');
}
