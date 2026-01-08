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
import { KitchenService } from '../../service/kitchen.service';

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
  public kitchenService = inject(KitchenService);
  private authService = inject(AuthService);
  private router = inject(Router);

  kitchen = this.kitchenService.kitchen;

  icons = Icons;

  ngOnInit() {
    const kitchenName = this.kitchen()?.name ?? 'LiveMenu';
    document.title = kitchenName + ' - Dashboard';
  }

  onLogout() {
    this.authService.logout();
  }

  getPageRouteName(): string {
    const url = this.router.url;
    if (url.includes('/add-new-item')) return 'Add New Item';
    if (url.includes('/menu')) return 'Menu Items';
    if (url.includes('/kitchen')) return 'Kitchen Profile';
    return 'Welcome';
  }

  getBreadcrumbs(): string[] {
    const url = this.router.url;
    const crumbs: string[] = [];

    if (url.includes('/menu')) {
      crumbs.push('Menu Items');
      if (url.includes('/add-new-item')) {
        crumbs.push('Add New Item');
      }
    } else if (url.includes('/kitchen')) {
      crumbs.push('Kitchen Profile');
    }

    return crumbs;
  }
}
