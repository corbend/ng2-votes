import * as moment_ from 'moment';
const moment = (<any>moment_)['default'] || moment_;
import {Component, OnInit, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Poll} from './models/poll';
import {Question} from './models/question';
import {PollService} from './poll-service';

@Injectable()
@Component({
	templateUrl: '/app/partials/poll-create-form.html'
})
export class PollCreateForm implements OnInit {
	newQuiz: Poll
	newQuestion: Question
	providers: [PollService]
	constructor(private poll_service: PollService, private _router: Router) { }
	ngOnInit() {
		this.newQuiz = {id: '', name: '', tag: '', fromDate: '', toDate: '', questions: [], answers: [] };
		this.newQuestion = { text: '', results: 0 };
	}
	create(poll: Poll) {
		var toDate = moment(poll.toDate, 'YYYY-MM-DD HH:mm:ss');
		var fromDate = moment(poll.fromDate, 'YYYY-MM-DD HH:mm:ss');
		if (toDate.isValid()) {
			poll.toDate = toDate.toDate().valueOf();
		} else return;
		if (fromDate.isValid()) {
			poll.fromDate = fromDate.toDate().valueOf();
		} else return;
		this.poll_service.create(poll);
		this._router.navigate(['Polls']);
	}
	cancel() {
		this._router.navigate(['Polls']);
	}
	addQuestion(question) {		
		this.newQuiz.questions.push(question);
		this.newQuestion = { text: '', results: 0 };
	}
	removeQuestion(question) {
		this.newQuiz.questions.splice(this.newQuiz.questions.indexOf(question), 1);
	}
}