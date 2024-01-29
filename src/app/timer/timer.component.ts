import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { atLeastOneValidator } from '../shared/validators';
import { trigger, style, animate, transition  } from '@angular/animations';

@Component({
  selector: 'app-countdown',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  animations: [
    trigger('fade', [
      transition(':leave', [animate(500, style({ opacity: 0 }))])
    ])
  ]
})

export class TimerComponent implements OnInit, OnDestroy {
  groupForm: FormGroup;
  timerForm: FormGroup;
  
  public showAccountCreated: boolean = false;
  public showAccountDeleted: boolean = false;
  countdowns: Array<{ group: string, targetDate: Date, timeLeft: string }> = [];
  timerGroups: string[] = [];
  private timerSubscription!: Subscription;


  constructor(private formBuilder: FormBuilder, private metaTagService: Meta, private titleService: Title) {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required]
    });

    this.timerForm  = this.formBuilder.group({
      selectedGroup: ['', Validators.required],
      days: ['', [Validators.min(0)]],
      hours: ['', [Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.min(0), Validators.max(59)]]
    }, { validators: atLeastOneValidator });
  }

  ngOnInit() {
    this.titleService.setTitle('Upgrade Helper - ClashMultiTimer');

    this.metaTagService.addTags([
      {name: 'description', content: 'ClashMultiTimer is a tool for Clash of Clans to help them organizing their upgrades.'},
      {name: 'keywords', content: 'Clash of Clans, ClashMultiTimer, Game, Tool, Upgrades'},
    ]);
  }

  onSubmitGroup(): void {
    let { groupName } = this.groupForm.value;
    
    if (groupName && !this.timerGroups.includes(groupName)) {
      this.showAccountCreated = true;
      this.timerGroups.push(groupName);
      setTimeout(() => {
        this.showAccountCreated = false;
      }, 2000);
    }
    
  }

  onSubmitTimer(): void {
    let { selectedGroup, days, hours, minutes } = this.timerForm.value;
    const group = selectedGroup || 'Default';
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

  confirmDelete(group: string): void {
    const confirmation = window.confirm('Are you sure you want to delete this group?');
    if (confirmation) {
      this.showAccountDeleted = true;
      this.deleteGroup(group);
      setTimeout(() => { 
        this.showAccountDeleted = false;
      } , 2000);
    }
  }

  deleteGroup(group: string): void {
    const index = this.timerGroups.indexOf(group);
    if (index > -1) {
      this.timerGroups.splice(index, 1);
    }

    this.countdowns = this.countdowns.filter(countdown => countdown.group !== group);
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
