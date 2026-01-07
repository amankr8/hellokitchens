import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { TenantService } from '../service/tenant.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const decodedToken = authService.getDecodedToken();

  try {
    const currentKitchen = await tenantService.waitUntilLoaded();

    if (decodedToken && decodedToken.kitchenId === currentKitchen.id) {
      return true;
    }

    console.error('Tenant Mismatch: Token is for a different kitchen');
    router.navigate(['/login']);
    return false;
  } catch (error) {
    console.error('Guard failed to resolve kitchen context', error);
    router.navigate(['/login']);
    return false;
  }
};
