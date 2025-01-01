import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Include this for reactive forms to work
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to display validation errors
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    this.authService.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          const role = this.authService.getRole();
          if (role === 'Admin') {
            this.router.navigate(['/home']);
          } else if (role === 'Customer') {
            this.router.navigate(['/shop']);
          }
        }
      },
      error: (err) => {
        debugger
        console.error('Login failed:', err); // Log error for debugging
  
        // Handle specific error codes or show a generic message
        if (err.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid email or password.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
  
        // Ensure change detection triggers to update the view
        this.cd.detectChanges();
      },
    });
  }
  
  
  

  
  
  
  
  
  
  
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
