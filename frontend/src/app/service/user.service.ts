import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user';

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
}
