import { Injectable } from '@angular/core';
import { Kitchen } from '../model/kitchen';

@Injectable({ providedIn: 'root' })
export class TenantService {
  kitchenDetails: Kitchen | null = null;
  loaded: boolean = false;

  async fetchKitchenDetails(): Promise<Kitchen | null> {
    if (this.loaded) return this.kitchenDetails;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.loaded) {
          clearInterval(interval);
          resolve(this.kitchenDetails);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, 5000);
    });
  }
}
