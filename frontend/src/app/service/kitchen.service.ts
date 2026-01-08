import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Kitchen } from '../model/kitchen';

@Injectable({ providedIn: 'root' })
export class KitchenService {
  private apiUrl = environment.apiBaseUrl + '/api/v1/kitchens';

  // 🔹 State signals
  private readonly _kitchen = signal<Kitchen | null>(null);
  readonly kitchen = this._kitchen.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // --------------------
  // Load (cached)
  // --------------------
  loadKitchen(): void {
    if (this._kitchen() !== null || this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<Kitchen>(this.apiUrl).subscribe({
      next: (kitchen) => {
        this._kitchen.set(kitchen);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load kitchen');
        this._loading.set(false);
      },
    });
  }

  // --------------------
  // Update
  // --------------------
  updateKitchen(kitchenId: number, kitchen: Kitchen): Observable<Kitchen> {
    this._error.set(null);

    return this.http
      .put<Kitchen>(`${this.apiUrl}/${kitchenId}`, kitchen)
      .pipe(tap((updated) => this._kitchen.set(updated)));
  }

  // --------------------
  // Utilities
  // --------------------
  clearCache(): void {
    this._kitchen.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}
