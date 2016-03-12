
import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Poll} from './models/poll';
import {Question} from './models/question';
import {PollService} from './poll-service';

@Component({
	templateUrl: '/app/partials/poll-edit-form.html'
})
export class PollEditForm implements OnInit {
	editedQuiz: Poll
	newQuestion: Question
	pollId: string
	providers: [PollService]
	constructor(private _router: Router, private poll_service: PollService, params: RouteParams) { 
		this.pollId = params.get('pollId');		
	}
	ngOnInit() {

		this.editedQuiz = { id: '', name: '', tag: '', fromDate: '', toDate: '', questions: [], answers: [] };
		this.newQuestion = { text: '', results: 0 };

		this.poll_service.getById(this.pollId).subscribe((p) => {
			this.editedQuiz = p;
			this.editedQuiz.id = this.pollId;
		});

	}
	save(poll: Poll) {
		this.poll_service.update(poll, () => this._router.navigate(['Polls']));
	}
	cancel() {
		this._router.navigate(['Polls']);
	}
	addQuestion(question: Question) {
		this.editedQuiz.questions.push(question);
		this.newQuestion = { text: '', results: 0 };
	}
	removeQuestion(question) {
		this.editedQuiz.questions.splice(this.editedQuiz.questions.indexOf(question), 1);
	}
}