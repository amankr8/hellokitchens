import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../enum/user-role.enum';

export const authGuard =
  (allowedRole: UserRole): CanActivateFn =>
  () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    if (!authService.hasRole(allowedRole)) {
      router.navigate(['/not-found']);
      return false;
    }

    return true;
  };
