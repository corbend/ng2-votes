import {Injectable, OnInit} from 'angular2/core';
import {Poll} from './models/poll';
import {Observable} from 'rxjs/Rx';

const keyFieldName = "$$fbKey";

function observableFirebaseObject<T>(ref: FirebaseQuery): Observable<T> {
	return Observable.create(function(observer: any) {
		function value(snapshot: FirebaseDataSnapshot) {
			observer.next(snapshot.val());
		}
		ref.on('value', value);
		return function() {
			ref.off('value', value);
		}
	});
}

function observableFirebaseArray<T>(ref: FirebaseQuery): Observable<T[]> {

	return Observable.create(function(observer: any) {
		// Looking for how to type this well.
		let arr: any[] = [];


		function child_added(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
			let child = snapshot.val();
			child[keyFieldName] = snapshot.key();
			let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
			arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
			observer.next(arr.slice()); // Safe copy
		}

		function child_changed(snapshot: FirebaseDataSnapshot) {
			let key = snapshot.key();
			let child = snapshot.val();
			// TODO replace object rather than mutate it?
			let x = arr.find((y) => y[keyFieldName] === key);
			if (x) {
				for (var k in child) x[k] = child[k];
			}
			observer.next(arr.slice()); // Safe copy
		}

		function child_removed(snapshot: FirebaseDataSnapshot) {
			let key = snapshot.key();
			let child = snapshot.val();
			let x = arr.find((y) => y[keyFieldName] === key);
			if (x) {
				arr.splice(arr.indexOf(x), 1);
			}
			observer.next(arr.slice()); // Safe copy
		}

		function child_moved(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
			let key = snapshot.key();
			let child = snapshot.val();
			child[keyFieldName] = key;
			// Remove from old slot
			let x = arr.find((y) => y[keyFieldName] === key);
			if (x) {
				arr.splice(arr.indexOf(x), 1);
			}
			// Add in new slot
			let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
			if (prevEntry) {
				arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
			} else {
				arr.splice(0, 0, child);
			}
			observer.next(arr.slice()); // Safe copy
		}

		// Start out empty, until data arrives
		observer.next(arr.slice()); // Safe copy

		ref.on('child_added', child_added);
		ref.on('child_changed', child_changed);
		ref.on('child_removed', child_removed);
		ref.on('child_moved', child_moved);

		return function() {
			ref.off('child_added', child_added);
			ref.off('child_changed', child_changed);
			ref.off('child_removed', child_removed);
			ref.off('child_moved', child_moved);
		}
	});
}

@Injectable()
export class PollService implements OnInit {
	ref: Firebase
	_db: Firebase
	db_name: string
	_polls: Observable<any[]>
	poll: Observable<any>
	constructor() {
		this.db_name = "polls";
		this.ref = new Firebase("https://dazzling-heat-916.firebaseio.com/");
		this._db = this.ref.child(this.db_name);
		this._polls = observableFirebaseArray(this._db);		
	}
	ngOnInit() {
		this._polls = observableFirebaseArray(this._db);
	}
	getAll(): Observable<Poll[]> {
		return this._polls;
	}
	getById(id: string): Observable<Poll> {
		var sub_ref = this._db.child(id);
		var obs: Observable<Poll> = observableFirebaseObject(sub_ref);

		return obs;
	}
	remove(id: string): boolean {
		var sub_ref = this._db.child(id);
		var obs: Observable<Poll> = observableFirebaseObject(sub_ref);
		sub_ref.remove();
		return true;
	}
	create(poll: Poll): boolean {
		this._db.push(poll);
		return true;
	}
	update(poll: Poll, callback): boolean {
		var sub_ref = this._db.child(poll.id);
		sub_ref.update(poll, callback);
		return true;
	}
}