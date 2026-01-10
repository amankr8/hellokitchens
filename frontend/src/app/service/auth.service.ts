import { inject, Injectable } from '@angular/core';
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
  private jwtHelper = inject(JwtHelperService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = environment.apiBaseUrl + '/api/v1/auth';

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  firebaseLogin(firebaseToken: string) {
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/phone-login?firebaseToken=${firebaseToken}`,
        null
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getDecodedToken() {
    const token = localStorage.getItem('token');
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  hasRole(role: UserRole) {
    const decodedToken = this.getDecodedToken();
    return role === decodedToken?.role;
  }

  isUserLogin() {
    return this.isAuthenticated() && this.hasRole(UserRole.USER);
  }
}
