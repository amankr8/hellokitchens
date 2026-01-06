import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TenantService } from '../../service/tenant.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  public tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);

  getActiveRouteName(): string {
    const urlParts = this.router.url.split('/');
    return urlParts[urlParts.length - 1] || 'Overview';
  }

  onLogout() {
    this.authService.logout();
  }
}
