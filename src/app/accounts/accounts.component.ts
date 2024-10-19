import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from '../account-card/account-card.component';
import { AccountData, AccountChangeEvent } from '../shared/interfaces/account.interface'; // Update the path as needed

@Component({
  selector: 'app-accounts',
  standalone: true,
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],  // Corrected property name and made it an array
  imports: [CommonModule, AccountCardComponent]
})
export class AccountsComponent {
  accounts: AccountData[] = [  // Use the AccountData interface to ensure type safety
    { 
      name: 'Wackelkontakt',
      notificationsEnabled: false, 
      buildersUsed: 2,
      labUsed: 3,
      maxBuilders: 6,
      maxLab: 1,
      editBuilders: false,
      editLab: false 
    },{ 
      name: 'W4ck3lk0nt4kt',
      notificationsEnabled: false, 
      buildersUsed: 3,
      labUsed: 2,
      maxBuilders: 6,
      maxLab: 1,
      editBuilders: false,
      editLab: false 
    }
  ];

  handleDataChange(event: AccountChangeEvent, index: number): void {
    const field = event.field;
    const newValue = event.value;
    const account = this.accounts[index];

    if (field === 'name') {
      account.name = String(newValue);
    } else if (field === 'notificationsEnabled' || field === 'editBuilders' || field === 'editLab') {
      account[field] = newValue === 'true' ? true : false;
    } else if (field === 'buildersUsed' || field === 'labUsed'|| field === 'maxLab'|| field === 'maxBuilders') {
      account[field] = Number(newValue);
    }
    // Emit an event or handle further changes as needed
  }

  toggleEditLab(index: number): void {
    this.accounts[index].editLab = !this.accounts[index].editLab;
  }
}

