import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guard/auth.guard';
import { KitchenComponent } from './pages/dashboard/kitchen/kitchen.component';
import { MenuListComponent } from './pages/dashboard/menu-list/menu-list.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'kitchen', pathMatch: 'full' },
      { path: 'kitchen', component: KitchenComponent },
      { path: 'menu', component: MenuListComponent },
    ],
  },
];
