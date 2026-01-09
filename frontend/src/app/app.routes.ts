import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guard/auth.guard';
import { KitchenComponent } from './pages/dashboard/kitchen/kitchen.component';
import { MenuListComponent } from './pages/dashboard/menu-list/menu-list.component';
import { AddMenuItemComponent } from './pages/dashboard/menu-list/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from './pages/dashboard/menu-list/edit-menu-item/edit-menu-item.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

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
      {
        path: 'menu',
        children: [
          { path: '', component: MenuListComponent },
          { path: 'add', component: AddMenuItemComponent },
          { path: 'edit/:id', component: EditMenuItemComponent },
        ],
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
