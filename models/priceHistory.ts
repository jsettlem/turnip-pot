import {TimeService} from "../services/timeService";
import Week = TimeService.Week;

export type Pattern = "small" | "large" | "fluctuating" | "decreasing";

export class PriceHistory {
	constructor(public currentWeek: Week,
	            public previousPattern: Pattern | undefined,
	            public prices: number[],
	            public currentPattern: Pattern | undefined) {
		let trueCurrentWeek = TimeService.currentWeek();
		if (this.currentWeek != trueCurrentWeek) {
			this.previousPattern = this.currentPattern;
			this.prices = Array<number>(13).fill(0);
			this.currentWeek = trueCurrentWeek
		}
	}

	public getProphetLink() {
		return `https://turnipprophet.io?prices=${this.prices.join(".")}`
	}
}
