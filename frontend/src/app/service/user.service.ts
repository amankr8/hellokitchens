import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Address, User } from '../model/user';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiBaseUrl + '/api/v1/users';

  // 🔹 State signals
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // --------------------
  // Load (cached)
  // --------------------
  loadUser(): void {
    if (this._user() !== null || this._loading()) return;
    this.fetchUserDetails();
  }

  refreshUser(): void {
    this.fetchUserDetails();
  }

  private fetchUserDetails(): void {
    if (this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<User>(this.apiUrl).subscribe({
      next: (user) => {
        this._user.set(user);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load user details');
        this._loading.set(false);
      },
    });
  }

  // --------------------
  // Mutations
  // --------------------
  registerUser(payload: { name: string }): Observable<User> {
    this._error.set(null);

    return this.http.post<User>(this.apiUrl, payload).pipe(
      tap((user) => {
        this._user.set(user);
      }),
    );
  }

  addAddress(payload: Address): Observable<Address> {
    this._error.set(null);

    return this.http.post<Address>(`${this.apiUrl}/addresses`, payload).pipe(
      tap((address) => {
        const user = this._user();

        if (!user) {
          this.loadUser();
          return;
        }

        this.appendAddress(address);
      }),
    );
  }

  private appendAddress(address: Address): void {
    this._user.update((user) =>
      user
        ? {
            ...user,
            defaultAddressId: user.defaultAddressId ?? address.id,
            addresses: [...user.addresses, address],
          }
        : user,
    );
  }

  updateAddress(addressId: number, payload: Address): Observable<Address> {
    this._error.set(null);

    return this.http
      .put<Address>(`${this.apiUrl}/addresses/${addressId}`, payload)
      .pipe(
        tap((updatedAddress) => {
          const user = this._user();

          if (!user) {
            this.loadUser();
            return;
          }

          this.replaceAddress(updatedAddress);
        }),
      );
  }

  private replaceAddress(updated: Address): void {
    this._user.update((user) =>
      user
        ? {
            ...user,
            addresses: user.addresses.map((p) =>
              p.id === updated.id ? updated : p,
            ),
          }
        : user,
    );
  }

  deleteAddress(addressId: number): Observable<void> {
    this._error.set(null);

    const previousUser = this._user();

    this._user.update((user) =>
      user
        ? {
            ...user,
            addresses: user.addresses.filter((p) => p.id !== addressId),
          }
        : user,
    );

    return this.http.delete<void>(`${this.apiUrl}/addresses/${addressId}`).pipe(
      catchError((err) => {
        this._user.set(previousUser);
        return throwError(() => err);
      }),
    );
  }

  // --------------------
  // Utilities
  // --------------------
  clearCache(): void {
    this._user.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}
