import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const keys = ['days', 'hours', 'minutes'];
  const hasAtLeastOne = keys.some(key => formGroup.get(key)?.value);
  return hasAtLeastOne ? null : { 'atLeastOne': true };
};