import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        NgClass,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        NgIf
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    registerForm: FormGroup;
    isSubmitted: boolean = false;

    constructor(private fb: FormBuilder) {
        this.registerForm = this.fb.group(
    {
                name: ['', [Validators.required, Validators.minLength(5)]],
                username: ['', [Validators.required, Validators.minLength(5)]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
            });
    }

    // Getter
    get name() {
        return this.registerForm.get('name');
    }

    get username() {
        return this.registerForm.get('username');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    onSubmit() {
        this.isSubmitted = true;

        if (this.registerForm.valid) {
            console.log('Form Data:', this.registerForm.value);
            alert('Registration successful!');
            this.resetForm();
        } else {
            console.log('Form is invalid');
        }
    }

    resetForm() {
        this.registerForm.reset();
        this.isSubmitted = false;
    }

}
