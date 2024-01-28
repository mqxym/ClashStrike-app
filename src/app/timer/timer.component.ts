import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { atLeastOneValidator } from '../shared/validators';

@Component({
  selector: 'app-countdown',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})

export class TimerComponent implements OnDestroy {
  countdownForm: FormGroup;
  countdowns: Array<{ group: string, targetDate: Date, timeLeft: string }> = [];
  timerGroups: string[] = [];
  private timerSubscription!: Subscription;


  constructor(private formBuilder: FormBuilder) {
    // Initialize the form with validators
    this.countdownForm = this.formBuilder.group({
      groupName: [''],
      selectedGroup: [''],
      days: ['', [Validators.min(0)]],
      hours: ['', [Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.min(0), Validators.max(59)]]
    }, { validators: atLeastOneValidator });
  }

  onSubmit(): void {
    let { groupName, selectedGroup, days, hours, minutes } = this.countdownForm.value;
    if (groupName && !this.timerGroups.includes(groupName)) {
      this.timerGroups.push(groupName);
    }
    const group = selectedGroup || groupName || 'Default';
    minutes = minutes || 0;
    days = days || 0;
    hours = hours || 0;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days, 10));
    targetDate.setHours(targetDate.getHours() + parseInt(hours, 10));
    targetDate.setMinutes(targetDate.getMinutes() + parseInt(minutes, 10));

    this.countdowns.push({ group, targetDate, timeLeft: this.calculateTimeLeft(targetDate) });

    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.countdowns.forEach(countdown => {
          countdown.timeLeft = this.calculateTimeLeft(countdown.targetDate);
        });
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer to prevent memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
