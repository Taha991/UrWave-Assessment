import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.info('LoginGuard: User already authenticated. Redirecting to home.');
    router.navigate(['/home']); // Redirect authenticated users to home
    return false;
  }
  return true;
};
