import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Define dynamic roles if needed
  const dynamicRoles = ['Admin', 'Customer']; // Example: Could be fetched from an API or service
  const requiredRoles = route.data?.['roles'] || dynamicRoles; // Fallback to dynamic roles if not defined in route

  const userRole = authService.getRole(); // Retrieve role from auth service

  if (!userRole || !requiredRoles.includes(userRole)) {
    console.error(`RoleGuard: Access denied. User role: ${userRole}, required roles: ${requiredRoles}`);
    router.navigate(['/403']); // Redirect to Forbidden page
    return false;
  }

  return true;
};
