import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/dashboard/login/login.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'dashboard',
    children: [
      { path: '', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
    ],
  },
];
