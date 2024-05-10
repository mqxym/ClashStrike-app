import { Route } from '@angular/router';
import { TimerComponent } from './timer/timer.component';



export const routes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to /home
  { path: 'timer', component: TimerComponent }, // Main page route
  { path: 'accounts', component: TimerComponent},
  { path: 'overview', component: TimerComponent },
  { path: '**', redirectTo: '/overview' }, // Wildcard route to redirect any unmatched paths to /home
];
