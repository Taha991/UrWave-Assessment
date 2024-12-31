import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};
    // const hasUpperCase = /[A-Z]/.test(value);
    // const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    // const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // if (!hasUpperCase) errors['missingUpperCase'] = true;
    // if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumeric) errors['missikngNumeric'] = true;
    // if (!hasSpecialCharacter) errors['missingSpecialCharacter'] = true;

    return Object.keys(errors).length ? errors : null;
  };
};