import {bootstrap} from 'angular2/platform/browser';
import {App} from './app';
import {PollService} from './poll-service';

bootstrap(App, [PollService]);
