import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { TenantService } from '../service/tenant.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/dashboard/login']);
    return false;
  }

  const decodedToken = authService.getDecodedToken();
  const currentKitchenId = tenantService.kitchenDetails?.id;

  if (!currentKitchenId) {
    console.warn('Kitchen details not yet loaded. Waiting for context...');
    return true;
  }

  if (decodedToken && decodedToken.kitchenId === currentKitchenId) {
    return true;
  }

  console.error('Tenant Mismatch: Token is for a different kitchen');
  router.navigate(['/dashboard/login']);
  return false;
};
