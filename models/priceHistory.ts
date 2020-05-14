import {TimeService} from "../services/timeService";
import Week = TimeService.Week;
import * as AsciiTable from 'ascii-table';
import {PriceHistoryService} from "../services/priceHistoryService";

export type Pattern = "fluctuating" | "large" | "decreasing" | "small" ;
export const patternList: Pattern[] = ["fluctuating", "large", "decreasing", "small"]

export class PriceHistory {


	constructor(public currentWeek: Week,
	            public previousPattern: Pattern | undefined,
	            public prices: number[],
	            public currentPattern: Pattern | undefined) {
		let trueCurrentWeek = TimeService.currentWeek();
		if (this.currentWeek.year != trueCurrentWeek.year || this.currentWeek.week != trueCurrentWeek.week) {
			this.previousPattern = this.currentPattern;
			this.prices = Array<number>(13).fill(0);
			this.currentWeek = trueCurrentWeek
		}
	}

	public getProphetLink() {
		return `https://turnipprophet.io?prices=${this.prices.join(".")}$pattern=${this.previousPattern ? patternList.indexOf(this.previousPattern) : ''}`
	}

	public asASCIITable(): string {
		let table = new AsciiTable(`Year: ${this.currentWeek.year}, Week: ${this.currentWeek.week}, Previous pattern: ${this.previousPattern ?? 'unknown'}`);
		table
			.setHeading(...PriceHistoryService.timeNames)
			.addRow(...this.prices.map(p => p === 0 ? "" : p));

		return table.toString();
	}

	public getMessage(): string {
		return `\`\`\`\n${this.asASCIITable()}\`\`\`\n Prediction: <${this.getProphetLink()}>`
	}
}
