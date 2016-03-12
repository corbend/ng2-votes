
import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {PollService} from './poll-service';
import {Poll} from './models/poll';
import {Question} from './models/question';

interface QuestionSelect extends Question {
	text: string
	selected: boolean
	count: number	
}

@Component({
	templateUrl: '/app/partials/poll-session.html',
	providers: [PollService]
})
export class PollSession implements OnInit {
	pollId: string
	sessionQuiz: Poll
	questions: QuestionSelect[]
	constructor(private _poll_service: PollService, private _router: Router, params: RouteParams) {
		this.pollId = params.get('pollId');
		this.sessionQuiz = { id: '', name: '', tag: '', fromDate: '', toDate: '', answers: [], questions: [] };
	}
	ngOnInit() {
		this._poll_service.getById(this.pollId).subscribe((data) => {
			this.sessionQuiz = data;
			this.sessionQuiz.id = this.pollId;
			if (!this.sessionQuiz.answers) {
				this.sessionQuiz.answers = [];
			}
			this.questions = this.sessionQuiz.questions.map((q, index) => {
				var qa: QuestionSelect = { text: q.text, selected: false, results: q.results, count: 0 };				
				return qa;
			})
		})
	}
	cancel() {
		this._router.navigate(['Polls']);
	}
	calculatePercentage(poll: Poll) {

		var amounts = new Array(poll.questions.length);
		poll.answers.forEach((a, index) => {
			if (!amounts[a.value]) amounts[a.value] = 0;
			amounts[a.value] += 1;
		})
		var sum = 0;
		amounts.forEach((a) => sum += a);	

		amounts.forEach((a, index) => {
			poll.questions[index].results = Math.floor((a / sum) * 100);
		})		
	}
	vote() {
		var selectedAnswerIdx;

		this.questions.forEach(function(v, index) {
			if (v.selected) {
				selectedAnswerIdx = index;
			}
		})

		this.sessionQuiz.answers.push({	value: selectedAnswerIdx });

		this.sessionQuiz.votes = (this.sessionQuiz.votes || 0) + 1;
		this.questions[selectedAnswerIdx].selected = false;

		this.calculatePercentage(this.sessionQuiz);
		this._poll_service.update(this.sessionQuiz, () => {			
			this._router.navigate(['Results', { pollId: this.sessionQuiz.id }]);			
		});
	}
}