import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Kitchen } from '../model/kitchen';
import { filter, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private _kitchenDetails = signal<Kitchen | null>(null);
  public kitchenDetails = this._kitchenDetails.asReadonly();

  async waitUntilLoaded(): Promise<Kitchen> {
    const current = this._kitchenDetails();
    if (current) return current;

    // Otherwise, convert the signal to an observable and wait for the first non-null value
    return firstValueFrom(
      toObservable(this._kitchenDetails).pipe(
        filter((details): details is Kitchen => details !== null)
      )
    );
  }

  setKitchenDetails(data: Kitchen) {
    this._kitchenDetails.set(data);
  }
}
