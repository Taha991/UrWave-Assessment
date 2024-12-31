import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  formSubmitted = false; // Flag to track if the form has been submitted

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister(): void {
    this.formSubmitted = true; // Set the flag to true when the button is pressed
  
    if (this.registerForm.valid) {
      const userRegistrationData = {
        Username: this.registerForm.value.username,
        Email: this.registerForm.value.email,
        Password: this.registerForm.value.password,
        Role: 'Customer', // Static role
      };
  
      this.userService.createUser(userRegistrationData).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Check if the error is related to duplicate fields
          if (err?.status === 409 && err.error?.Detail) {
            this.errorMessage = err.error.Detail;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
      });
    }
  }
  
}
