import moment = require('moment')

export namespace TimeService {

	export class Week {
		constructor(public year: number, public week: number) {
		}
	}

	export function currentWeek(): Week {
		let m = moment();
		m.locale('en');
		return new Week(m.weekYear(), m.week());
	}

	export function getCurrentTime() {
		let m = moment();
		m.locale('en');
		let dayOfWeek: number = m.weekday();
		if (dayOfWeek == 0) {
			return 0;
		} else {
			let am: boolean = m.hour() < 12
			if (am) {
				return (dayOfWeek) * 2 - 1
			} else {
				return (dayOfWeek) * 2
			}
		}
	}
}
