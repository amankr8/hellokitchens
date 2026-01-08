import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../model/menu-item';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = environment.apiBaseUrl + '/api/v1/menus';

  // 🔹 State signals
  private readonly _menuItems = signal<MenuItem[] | null>(null);
  readonly menuItems = this._menuItems.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // --------------------
  // Load menu
  // --------------------
  loadMenuItems(): void {
    if (this._menuItems() !== null || this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<MenuItem[]>(this.apiUrl).subscribe({
      next: (items) => {
        this._menuItems.set(items);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load menu items');
        this._loading.set(false);
      },
    });
  }

  // --------------------
  // Mutations
  // --------------------
  addMenuItem(formData: FormData): Observable<MenuItem> {
    this._error.set(null);

    return this.http
      .post<MenuItem>(this.apiUrl, formData)
      .pipe(
        tap((item) =>
          this._menuItems.update((items) => (items ? [...items, item] : [item]))
        )
      );
  }

  updateMenuItem(itemId: number, item: MenuItem): Observable<MenuItem> {
    this._error.set(null);

    return this.http
      .put<MenuItem>(`${this.apiUrl}/${itemId}`, item)
      .pipe(
        tap((updated) =>
          this._menuItems.update(
            (items) =>
              items?.map((i) => (i.id === updated.id ? updated : i)) ?? null
          )
        )
      );
  }

  toggleAvailability(itemId: number): Observable<void> {
    this._error.set(null);

    return this.http
      .patch<void>(`${this.apiUrl}/${itemId}`, null)
      .pipe(
        tap(() =>
          this._menuItems.update(
            (items) =>
              items?.map((i) =>
                i.id === itemId ? { ...i, inStock: !i.inStock } : i
              ) ?? null
          )
        )
      );
  }

  deleteMenuItem(id: number): Observable<void> {
    this._error.set(null);

    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() =>
          this._menuItems.update(
            (items) => items?.filter((i) => i.id !== id) ?? null
          )
        )
      );
  }

  // --------------------
  // Utilities
  // --------------------
  clearError(): void {
    this._error.set(null);
  }

  clearCache(): void {
    this._menuItems.set(null);
  }
}
