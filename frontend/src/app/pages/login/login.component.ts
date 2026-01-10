import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icons } from '../../utils/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { UiService } from '../../service/ui.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private uiService = inject(UiService);

  icons = Icons;

  loading = signal(false);
  error = signal<string | null>(null);
  username: string = '';
  password: string = '';

  onLogin() {
    this.loading.set(true);
    this.error.set(null);

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.uiService.showToast('Logged in successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Invalid username or password');
        },
      });
  }
}
