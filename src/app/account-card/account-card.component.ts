import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData, AccountChangeEvent } from '../shared/interfaces/account.interface';


@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.css'
})
export class AccountCardComponent {
  @Input() account: AccountData = { 
    name: 'Account Name', 
    notificationsEnabled: false, 
    buildersUsed: 0,
    labUsed: 0,
    maxBuilders: 6,
    maxLab: 1,
    editBuilders: false,
    editLab: false
  };
  @Output() dataChange = new EventEmitter<AccountChangeEvent>();

  editData(field: keyof AccountData, newValue: string | boolean | number): void {
    switch (field) {
        case 'name':
            this.account.name = newValue as string;
            this.emitChangeEvent('name', this.account.name);
            break;
        case 'notificationsEnabled':
            if (typeof newValue === 'boolean') {
                this.account.notificationsEnabled = newValue;
                this.emitChangeEvent('notificationsEnabled', this.account.notificationsEnabled);
            }
            break;
        case 'buildersUsed':
            if (typeof newValue === 'number') {
                this.account.buildersUsed = newValue;
                this.emitChangeEvent('buildersUsed', this.account.buildersUsed);
            }
            break;
        case 'maxLab':
            if (typeof newValue === 'number') {
                this.account.buildersUsed = newValue;
                this.emitChangeEvent('maxLab', this.account.maxLab);
            }
            break;
        case 'maxBuilders':
            if (typeof newValue === 'number') {
                this.account.buildersUsed = newValue;
                this.emitChangeEvent('maxBuilders', this.account.maxBuilders);
            }
            break;
        case 'labUsed':
            if (typeof newValue === 'number') {
                this.account.labUsed = newValue;
                this.emitChangeEvent('labUsed', this.account.labUsed);
            }
            break;
        case 'editBuilders':
            if (typeof newValue === 'boolean') {
                this.account.editBuilders = newValue;
                this.emitChangeEvent('editBuilders', this.account.editBuilders);
            }
            break;
        case 'editLab':
            if (typeof newValue === 'boolean') {
                this.account.editLab = newValue;
                this.emitChangeEvent('editLab', this.account.editLab);
            }
            break;
        default:
            console.error('Invalid type or field:', field);
            return;
    }
}

private emitChangeEvent(field: keyof AccountData, value: any) {
    this.dataChange.emit({ field, value });
}


}
