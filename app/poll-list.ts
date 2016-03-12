
import * as moment_ from 'moment';
const moment = (<any>moment_)['default'] || moment_;
import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Poll} from './models/poll';
import {Router} from 'angular2/router';
import {PollService} from './poll-service';
import {MapToIterable} from './directives/mapToIterable';

const keyFieldName = "$$fbKey";

@Component({
	templateUrl: '/app/partials/poll-list.html',
	pipes: [MapToIterable]
})
export class PollList implements OnInit {
	constructor(private _router: Router, private poll_service: PollService) {	}
	providers: [PollService]
	polls: Observable<Poll[]>
	pollsTimers: Object
	ngOnInit() {
		this.polls = this.poll_service.getAll();
		this.pollsTimers = {};

		this.polls.subscribe((data) => {

			data.forEach((v, index) => {

				var poll = data[index];
				var now = new Date().getTime();

				if (!poll.toDateFormatted) {
					var pollToDate = moment(Number(poll.toDate)).format("DD-MM-YYYY HH:mm:ss");
					poll.toDateFormatted = pollToDate;
				}
				if (!poll.fromDateFormatted) {
					var pollFromDate = moment(Number(poll.fromDate)).format("DD-MM-YYYY HH:mm:ss");	
					poll.fromDateFormatted = pollFromDate;
				}

				this.pollsTimers[poll[keyFieldName]] = poll;

				if (now > Number(poll.toDate)) {
					poll.ended = true;
				} else {
					window.setInterval(() => {
						var startTime = moment();
						var endTime = moment(Number(poll.toDate));

						if (now > Number(poll.toDate)) {
							poll.ended = true;
						}
						poll.timeRemainingAll = endTime.from(startTime);
						this.pollsTimers[poll[keyFieldName]] = poll;
					}, 1000);
				}

			})
		})
	}
	start(poll: Poll) {
		this._router.navigate(['Session', { pollId: poll[keyFieldName] }]);
	}
	edit(poll: Poll) {
		this._router.navigate(['Edit', { pollId: poll[keyFieldName] }]);
	}
	remove(poll: Poll) {
		this.poll_service.remove(poll[keyFieldName]);
	}
	create() {
		this._router.navigate(['Create', {}]);
	}
}