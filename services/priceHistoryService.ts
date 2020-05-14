import {TimeService} from "./timeService";
import * as config from "../config.json"

const keyv = require('keyv');
import {Snowflake} from "discord.js";
import {PriceHistory} from "../models/priceHistory";

export namespace PriceHistoryService {
	export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	export const timeNames = [dayNames[0].substr(0, 2)]
		.concat(...dayNames.slice(1).map(d => [d.substr(0, 2) + " AM", d.substr(0, 2) + " PM"]));

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
