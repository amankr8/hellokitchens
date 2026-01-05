import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { TenantService } from '../service/tenant.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/dashboard/login']);
    return false;
  }

  const decodedToken = authService.getDecodedToken();
  const currentKitchen = await tenantService.fetchKitchenDetails();

  if (!currentKitchen) {
    console.warn('Kitchen details not yet loaded. Waiting for context...');
    router.navigate(['/dashboard/login']);
    return false;
  }

  if (decodedToken && decodedToken.kitchenId === currentKitchen.id) {
    return true;
  }

  console.error('Tenant Mismatch: Token is for a different kitchen');
  router.navigate(['/dashboard/login']);
  return false;
};
