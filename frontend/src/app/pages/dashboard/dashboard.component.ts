import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; //
import { Icons } from '../../utils/icons'; //
import { AuthService } from '../../service/auth.service';
import { TenantService } from '../../service/tenant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  public tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);

  icons = Icons;

  onLogout() {
    this.authService.logout();
  }

  getActiveRouteName(): string {
    const urlParts = this.router.url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (!lastPart || lastPart === 'dashboard') {
      return '';
    }
    return lastPart.replace(/-/g, ' ');
  }
}
