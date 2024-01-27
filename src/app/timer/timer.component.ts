import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval, Subscription, EMPTY } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class TimerComponent implements OnInit, OnDestroy {
  countdownForm: FormGroup;
  countdowns: Array<{ targetDate: Date, timeLeft: string }> = [];
  private timerSubscription!: Subscription;


  constructor(private formBuilder: FormBuilder) {
    // Initialize the form with validators
    this.countdownForm = this.formBuilder.group({
      days: ['', [Validators.required, Validators.min(0)]],
      hours: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
    });
     
  }

  ngOnInit(): void {
   // Set up a timer to update the countdowns every second
   this.timerSubscription = interval(1000).subscribe(() => {
    this.countdowns.forEach(countdown => {
      countdown.timeLeft = this.calculateTimeLeft(countdown.targetDate);
      if (countdown.timeLeft === 'Time is up!') {
        // Optional: Remove countdown when time is up
        this.countdowns = this.countdowns.filter(c => c.timeLeft !== 'Time is up!');
      }
    });
  });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer to prevent memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    const { days, hours, minutes } = this.countdownForm.value;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days, 10));
    targetDate.setHours(targetDate.getHours() + parseInt(hours, 10));
    targetDate.setMinutes(targetDate.getMinutes() + parseInt(minutes, 10));

    this.countdowns.push({ targetDate, timeLeft: this.calculateTimeLeft(targetDate) });
  }

  private calculateTimeLeft(targetDate: Date): string {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return 'Time is up!';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
