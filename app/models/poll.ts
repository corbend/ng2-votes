
import {Question} from './question';
import {Answer} from './answer';

export interface Poll {
	id?: string,
	name: string,
	tag: string,
	fromDate: string,
	toDate: string,
	questions: Question[]
	answers: Answer[]
	votes?: number
	timeRemainingAll?: string
	ended?: boolean
	toDateFormatted?: string
	fromDateFormatted?: string
}