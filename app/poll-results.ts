
import {Component, OnInit} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';
import {Poll} from './models/poll';
import {PollService} from './poll-service';

@Component({
	templateUrl: '/app/partials/poll-results.html',
	directives: [NgStyle]
})
export class PollResultsList implements OnInit {
	pollId: string
	poll: Poll
	providers: [PollService]
	constructor(private poll_service: PollService, private _router: Router, params: RouteParams) {
		this.pollId = params.get('pollId');
		this.poll = { id: '', name: '', tag: '', fromDate: '', toDate: '', answers: [], questions: [] };
	}
	ngOnInit() {
		this.poll_service.getById(this.pollId).subscribe((data) => {
			this.poll = data;

			this.poll.questions.forEach((q, index) => {
				q.count = this.poll.answers.reduce((s, a) => { (a.value == index && (s += 1)); return s; }, 0);
			});

			this.poll.id = this.pollId;
		})
	}
	cancel() {
		this._router.navigate(['Polls']);
	}
}