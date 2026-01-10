import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../enum/user-role.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const decodedToken = authService.getDecodedToken();
    if (decodedToken?.role === UserRole.KITCHEN_OWNER) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};
