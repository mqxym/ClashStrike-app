import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { atLeastOneValidator } from '../shared/validators';
import { trigger, style, animate, transition  } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-countdown',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  animations: [
    trigger('fade', [
      transition(':leave', [animate(500, style({ opacity: 0 }))])
    ])
  ]
})

export class TimerComponent implements OnInit, OnDestroy {
  groupForm: FormGroup;
  timerForm: FormGroup;
  editGroupForm : FormGroup;
  
  public showAccountCreated: boolean = false;
  public showAccountDeleted: boolean = false;
  public showEditModal: boolean = false;
  countdowns: Array<{ group: string, targetDate: Date, timeLeft: string , id: number }> = [];
  timerGroups: string[] = [];
  private timerSubscription!: Subscription;
  


  constructor(private formBuilder: FormBuilder, private metaTagService: Meta, private titleService: Title) {
    this.groupForm = this.formBuilder.group({
      groupName: ['', [Validators.required, Validators.maxLength(15)]]
    });

    this.timerForm  = this.formBuilder.group({
      selectedGroup: ['', Validators.required],
      days: ['', [Validators.min(0)]],
      hours: ['', [Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.min(0), Validators.max(59)]],
      minutesNotVisible: [false]
    }, { validators: atLeastOneValidator });

    this.editGroupForm = this.formBuilder.group({
      selectedGroup: ['', Validators.required],
      newGroupName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Upgrade Helper - ClashMultiTimer');

    this.metaTagService.addTags([
      {name: 'description', content: 'ClashMultiTimer is a tool for Clash of Clans to help them organizing their upgrades.'},
      {name: 'keywords', content: 'Clash of Clans, ClashMultiTimer, Game, Tool, Upgrades'},
    ]);
    this.readFromLocalStorage();

    if (typeof window !== 'undefined' || typeof document !== 'undefined') {
      this.startTimers();
    }
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
    // Reset the form
    this.groupForm.reset();

    //Select the new group
    this.timerForm.get('selectedGroup')?.setValue(groupName);

    this.saveToLocalStorage();
    
  }

  onSubmitTimer(): void {
    let { selectedGroup, days, hours, minutes, minutesNotVisible } = this.timerForm.value;
    const group = selectedGroup || 'Default';
    minutes = minutes || 0;
    days = days || 0;
    hours = hours || 0;

    if (minutesNotVisible) {
      minutes = 0;
      if (hours == 23) {
        days++;
        hours = 0;
      } else {
        hours++;
      }
    } else {
      if (minutes > 0) {
        if (minutes == 59) {
          if (hours == 23) {
            days++;
            hours = 0;
          } else {
            hours++;
          }
          minutes = 0;
        } else {
          minutes++;
        }
      }  
    }
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days, 10));
    targetDate.setHours(targetDate.getHours() + parseInt(hours, 10));
    targetDate.setMinutes(targetDate.getMinutes() + parseInt(minutes, 10));

    let id = this.countdowns.filter(countdown => countdown.group === group).length + 1;

    let timeLeft = this.calculateTimeLeft(targetDate);
  
    this.countdowns.push({ group, targetDate, timeLeft: timeLeft , id: id});
    
    // Sort array by targetDate
    this.countdowns.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());

    this.saveToLocalStorage();

    //reset hours, minutes and days
    this.timerForm.get('days')?.setValue('');
    this.timerForm.get('hours')?.setValue('');
    this.timerForm.get('minutes')?.setValue('');

    this.startTimers();
  }

  startTimers(): void {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.countdowns.forEach(countdown => {
          countdown.timeLeft = this.calculateTimeLeft(countdown.targetDate);
        });
      });
    }
  }

  confirmDelete(group: string): void {
    const confirmation = window.confirm('Are you sure you want to delete this account?');
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
    if (this.timerForm) {
      const selectedGroupControl = this.timerForm.get('selectedGroup');
      if (selectedGroupControl && selectedGroupControl.value === group) {
        selectedGroupControl.setValue(''); // or '' if it should be an empty string
      }
    }

    this.countdowns = this.countdowns.filter(countdown => countdown.group !== group);
    this.saveToLocalStorage();
  }

  fastForward(group: string): void {
    const confirmation = window.confirm('Did you use a builder potion?');
    if (!confirmation) {
      return;
    }
    this.countdowns.forEach(countdown => {
      if (countdown.group === group) {
        countdown.targetDate.setHours(countdown.targetDate.getHours() - 9);
        countdown.timeLeft = this.calculateTimeLeft(countdown.targetDate);
      }
    });
    this.saveToLocalStorage();
  }

  showEditGroupForm(group: string): void {
    this.editGroupForm.get('selectedGroup')?.setValue(group);
    this.editGroupForm.get('newGroupName')?.setValue(group);
    this.showEditModal = true;
  }

  onSubmitEditGroup(): void {
    let { selectedGroup, newGroupName } = this.editGroupForm.value;
    const index = this.timerGroups.indexOf(selectedGroup);
    if (index > -1) {
      this.timerGroups[index] = newGroupName;
    }

    this.countdowns.forEach(countdown => {
      if (countdown.group === selectedGroup) {
        countdown.group = newGroupName;
      }
    });

    this.saveToLocalStorage();
    this.showEditModal = false;
  }

  deleteCountdown(id: number, group: string): void {
    const confirmation = window.confirm('Did you gem this upgrade?');
    if (!confirmation) {
      return;
    }
    this.countdowns = this.countdowns.filter(countdown => countdown.group !== group || countdown.id !== id);
    this.saveToLocalStorage();
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
      return 'Upgrade finished!';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    let timeLeft = '';

    if (days > 0) {
      timeLeft += `${days}d `;
    }
    if (hours > 0) {
      timeLeft += `${hours}h `;
    }
    if (minutes > 0) {
      timeLeft += `${minutes}m `;
    }
    if (seconds > 0) {
      timeLeft += `${seconds}s`;
    }

    return timeLeft.trim();
  }

  // Method to save timerGroups and countdowns to LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('timerGroups', JSON.stringify(this.timerGroups));
    localStorage.setItem('countdowns', JSON.stringify(this.countdowns));
  }

  // Method to read timerGroups and countdowns from LocalStorage
  readFromLocalStorage() {

    if (typeof localStorage !== 'undefined'){
      const storedTimerGroups = localStorage.getItem('timerGroups');
      const storedCountdowns = localStorage.getItem('countdowns');
  
      if (storedTimerGroups) {
        this.timerGroups = JSON.parse(storedTimerGroups);
      }
  
      if (storedCountdowns) {
        this.countdowns = JSON.parse(storedCountdowns);
        this.countdowns.forEach(countdown => {
          countdown.targetDate = new Date(countdown.targetDate);
        });
        // Set countdown.timeLeft for each countdown
        this.countdowns.forEach(countdown => {
          countdown.timeLeft = this.calculateTimeLeft(countdown.targetDate);
        });
      }
    }
    
    
  }
}
