import {TimeService} from "../services/timeService";
import * as AsciiTable from 'ascii-table';
import {PriceHistoryService} from "../services/priceHistoryService";
import {Predictor} from "../predictor/ac-nh-turnip-prices/js/predictions.js"
import Week = TimeService.Week;

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

	public predict() {
		let table = new AsciiTable().setHeading("Pattern", "Probability");
		let nanPrices = this.prices.map(p => p === 0 ? NaN : p)
		let possibilities = new Predictor([nanPrices[0]].concat(nanPrices), false, patternList.indexOf(this.previousPattern)).analyze_possibilities();
		let patternProbabilities = [0, 0, 0, 0]
		for (let p of [0, 1, 2, 3]) {
			let patternPossibilities = possibilities.filter(po => po?.pattern_number === p);
			if (patternPossibilities.length) {
				patternProbabilities[p] = patternPossibilities[0].category_total_probability;
			} else {
				patternProbabilities[p] = 0;
			}
			table.addRow(patternList[p], (patternProbabilities[p]*100).toFixed(2) + "%");
		}
		return table.toString();

	}

	public getProphetLink() {
		return `https://turnipprophet.io?prices=${this.prices.join(".")}&pattern=${this.previousPattern ? patternList.indexOf(this.previousPattern) : ''}`
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
