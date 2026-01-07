import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; //
import { Icons } from '../../utils/icons'; //
import { AuthService } from '../../service/auth.service';
import { TenantService } from '../../service/tenant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
  ],
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
    const url = this.router.url;

    if (url.includes('/dashboard/menu/add-new-item')) {
      return 'Menu Items / Add New Item';
    }

    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    if (!lastPart || lastPart === 'dashboard' || lastPart === 'kitchen') {
      return 'Kitchen Profile';
    }

    if (lastPart === 'menu') {
      return 'Menu Items';
    }

    return lastPart.replace(/-/g, ' ');
  }
}
