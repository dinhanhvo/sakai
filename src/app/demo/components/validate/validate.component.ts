import { Component } from '@angular/core';

import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-validate',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        NgIf,
        InputTextModule
    ],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent {

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, this.passwordStrengthValidator]],
        });
    }

    // Custom Validator
    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value || '';
        const hasNumber = /\d/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);

        if (!hasNumber || !hasUpperCase || !hasLowerCase) {
            return { weakPassword: true };
        }
        return null;
    }

    submitForm() {
        if (this.form.valid) {
            console.log('Form Submitted Successfully!', this.form.value);
        } else {
            console.error('Form is invalid. Fix the errors and try again.');
        }
    }

}
