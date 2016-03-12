
import {Component} from 'angular2/core';
import {PollList} from './poll-list';
import {PollCreateForm} from './poll-create-form';
import {PollEditForm} from './poll-edit-form';
import {PollResultsList} from './poll-results';
import {PollSession} from './poll-session';
import {Route, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {MapToIterable} from './directives/mapToIterable';

@Component({
    selector: "my-app",
    directives: [PollList, PollCreateForm, PollEditForm, PollResultsList, PollSession, ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    pipes: [MapToIterable],
    template: `<div class="app-container"><router-outlet></router-outlet></div>`
})
@RouteConfig([
    new Route({ path: '/', component: PollList, name: 'Home' }),
    new Route({ path: '/polls', component: PollList, name: 'Polls'}),
    new Route({ path: '/polls_session', component: PollSession, name: 'Session', data: {pollId: null} }),
    new Route({ path: '/polls_results', component: PollResultsList, name: 'Results', data: { pollId: null } }),
    new Route({ path: '/polls_create', component: PollCreateForm, name: 'Create'}),
    new Route({ path: '/polls_edit', component: PollEditForm, name: 'Edit', data: {pollId: null}})
])
export class App {

}