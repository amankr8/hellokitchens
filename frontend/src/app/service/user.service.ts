import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Profile, ProfilePayload, User } from '../model/user';
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
  addProfile(payload: ProfilePayload): Observable<Profile> {
    this._error.set(null);

    return this.http.post<Profile>(`${this.apiUrl}/profiles`, payload).pipe(
      tap((profile) => {
        const user = this._user();

        if (!user) {
          this.loadUser();
          return;
        }

        this.appendProfile(profile);
      })
    );
  }

  private appendProfile(profile: Profile): void {
    this._user.update((user) =>
      user
        ? {
            ...user,
            addresses: [...user.addresses, profile],
          }
        : user
    );
  }

  updateProfile(
    profileId: number,
    payload: ProfilePayload
  ): Observable<Profile> {
    this._error.set(null);

    return this.http
      .put<Profile>(`${this.apiUrl}/profiles/${profileId}`, payload)
      .pipe(
        tap((updatedProfile) => {
          const user = this._user();

          if (!user) {
            this.loadUser();
            return;
          }

          this.replaceProfile(updatedProfile);
        })
      );
  }

  private replaceProfile(updated: Profile): void {
    this._user.update((user) =>
      user
        ? {
            ...user,
            addresses: user.addresses.map((p) =>
              p.id === updated.id ? updated : p
            ),
          }
        : user
    );
  }

  deleteProfile(profileId: number): Observable<void> {
    this._error.set(null);

    const previousUser = this._user();

    this._user.update((user) =>
      user
        ? {
            ...user,
            addresses: user.addresses.filter((p) => p.id !== profileId),
          }
        : user
    );

    return this.http.delete<void>(`${this.apiUrl}/profiles/${profileId}`).pipe(
      catchError((err) => {
        this._user.set(previousUser);
        return throwError(() => err);
      })
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
