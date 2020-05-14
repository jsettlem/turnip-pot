import {TimeService} from "./timeService";
import * as config from "../config.json"

const keyv = require('keyv');
import {Snowflake} from "discord.js";
import {PriceHistory} from "../models/priceHistory";

export namespace PriceHistoryService {
	const users = new keyv(config.db, {'namespace': 'priceHistory'});

	export async function getPriceHistory(userId: Snowflake): Promise<PriceHistory> {
		let history: object = await users.get(userId);
		if (history !== undefined) {
			return new PriceHistory(history["currentWeek"],
				history["previousPattern"],
				history["prices"],
				history["currentPattern"])
		}
		return new PriceHistory(
			TimeService.currentWeek(),
			undefined,
			Array<number>(13).fill(0),
			undefined
		)
	}

	export function savePriceHistory(userId: Snowflake, priceHistory: PriceHistory): Promise<PriceHistory> {
		return users.set(userId, priceHistory)
	}

	users.set('foo', 'user');
}
