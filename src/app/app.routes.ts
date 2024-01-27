import { Route } from '@angular/router';
import { TimerComponent } from './timer/timer.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';



export const routes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to /home
  { path: 'home', component: HomeComponent }, // Main page route
  { path: 'timer', component: TimerComponent},
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];
