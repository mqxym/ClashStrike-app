import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Make sure the path is correct

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
  provideAnimations(), provideAnimationsAsync()]
}).catch(err => console.error(err));
