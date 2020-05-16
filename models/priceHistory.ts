import {TimeService} from "../services/timeService";
import * as AsciiTable from 'ascii-table';
import {PriceHistoryService} from "../services/priceHistoryService";
import {Predictor} from "../predictor/ac-nh-turnip-prices/js/predictions.js"
import Week = TimeService.Week;
import {Snowflake} from "discord.js";
import {arrayProp, prop} from "@typegoose/typegoose";

export type Pattern = "fluctuating" | "large" | "decreasing" | "small" ;
export const patternList: Pattern[] = ["fluctuating", "large", "decreasing", "small"]

export class PriceHistory {
	@prop()
	userName: string;
	@prop({index: true, unique: true})
	userId: Snowflake;
	@prop()
	currentWeek: Week;
	@prop()
	previousPattern: Pattern | undefined;
	@arrayProp({items: Number})
	prices: number[];
	@arrayProp({items: Number})
	predictions: number[];

	constructor(props) {
		this.userName = props.userName;
		this.userId = props.userId;
		this.currentWeek = props.currentWeek;
		this.previousPattern = props.previousPattern;
		this.prices = props.prices;
		this.predictions = props.predictions;
	}


	public updateWeek() {
		let trueCurrentWeek = TimeService.currentWeek();

		if (this.currentWeek.year != trueCurrentWeek.year || this.currentWeek.week != trueCurrentWeek.week) {
			let candidatePattern = this.predictions.indexOf(100);
			if (candidatePattern != -1) {
				this.previousPattern = patternList[candidatePattern];
			} else {
				this.previousPattern = undefined;
			}
			this.prices = Array<number>(13).fill(0);
			this.currentWeek = trueCurrentWeek
			this.predict();
		}
	}

	public predict() {
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
		}
		this.predictions = patternProbabilities;
	}

	public getPredictionTable() {
		let table = new AsciiTable().setHeading("Pattern", "Probability");
		for (let p of [0, 1, 2, 3]) {
			table.addRow(patternList[p], (this.predictions[p] * 100).toFixed(2) + "%");
		}
		return table.toString();
	}

	public getProphetLink() {
		return `https://turnipprophet.io?prices=${this.prices.join(".")}&pattern=${this.previousPattern ? patternList.indexOf(this.previousPattern) : ''}`
	}

	public asASCIITable(): string {

		let table = new AsciiTable(`${this.userName} - Previous: ${this.previousPattern ?? 'unknown'}`);

		table
			.setHeading("", ...PriceHistoryService.dayNames.map(d => d.substr(0, 2)))
			.addRow("AM", PriceHistoryService.priceToString(this.prices[0]), ...this.prices.slice(1).filter((e, i) => i % 2 === 0).map(PriceHistoryService.priceToString))
			.addRow("PM", "", ...this.prices.slice(1).filter((e, i) => i % 2 !== 0).map(PriceHistoryService.priceToString));

		return table.toString();
	}

	public getMessage(): string {
		return `\`\`\`\n${this.asASCIITable()}\`\`\`\n Prediction: <${this.getProphetLink()}>`
	}
}
