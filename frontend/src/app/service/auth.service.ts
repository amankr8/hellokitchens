import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserRole } from '../enum/user-role.enum';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'token';

  private jwtHelper = inject(JwtHelperService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = environment.apiBaseUrl + '/api/v1/auth';

  /** -------------------------------
   * Core signals
   * -------------------------------- */
  private _token = signal<string | null>(
    localStorage.getItem(this.STORAGE_KEY),
  );
  readonly token = this._token.asReadonly();

  private _decodedToken = computed(() => {
    const token = this._token();
    return token ? this.jwtHelper.decodeToken(token) : null;
  });

  /** -------------------------------
   * Public readonly signals
   * -------------------------------- */
  isAuthenticated = computed(() => {
    const token = this._token();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  });

  username = computed<string | null>(() => {
    return this._decodedToken()?.sub ?? 'Guest';
  });

  role = computed<UserRole | null>(() => {
    return this._decodedToken()?.role ?? null;
  });

  isKitchenLoggedIn = computed(
    () => this.isAuthenticated() && this.role() === UserRole.KITCHEN_OWNER,
  );

  isUserLoggedIn = computed(
    () => this.isAuthenticated() && this.role() === UserRole.USER,
  );

  /** -------------------------------
   * API calls
   * -------------------------------- */
  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(({ token }) => {
          this.setToken(token);
        }),
      );
  }

  firebaseLogin(firebaseToken: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/phone-login`, null, {
        params: { firebaseToken },
      })
      .pipe(
        tap(({ token }) => {
          this.setToken(token);
        }),
      );
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/']);
  }

  /** -------------------------------
   * Helpers
   * -------------------------------- */
  hasRole(role: UserRole): boolean {
    return this.isAuthenticated() && this.role() === role;
  }

  private setToken(token: string) {
    localStorage.setItem(this.STORAGE_KEY, token);
    this._token.set(token);
  }

  private clearToken() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._token.set(null);
  }
}
