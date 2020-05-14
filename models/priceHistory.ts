import {TimeService} from "../services/timeService";
import Week = TimeService.Week;

export type Pattern = "small" | "large" | "fluctuating" | "decreasing";

export class PriceHistory {
	constructor(public currentWeek: Week,
	            public previousPattern: Pattern | undefined,
	            public prices: number[]) {
	}

	public getProphetLink() {
		return `https://turnipprophet.io?prices=${this.prices.join(".")}`
	}
}
