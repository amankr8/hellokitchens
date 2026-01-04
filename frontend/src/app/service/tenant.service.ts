import { Injectable } from '@angular/core';
import { Kitchen } from '../model/kitchen';

@Injectable({ providedIn: 'root' })
export class TenantService {
  kitchenDetails: Kitchen | null = null;
}
