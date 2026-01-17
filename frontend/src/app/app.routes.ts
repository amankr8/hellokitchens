import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guard/auth.guard';
import { KitchenComponent } from './pages/dashboard/kitchen/kitchen.component';
import { MenuListComponent } from './pages/dashboard/menu-list/menu-list.component';
import { AddMenuItemComponent } from './pages/dashboard/menu-list/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from './pages/dashboard/menu-list/edit-menu-item/edit-menu-item.component';
import { PageNotFoundComponent } from './pages/components/page-not-found/page-not-found.component';
import { UserRole } from './enum/user-role.enum';
import { CartComponent } from './pages/homepage/cart/cart.component';
import { OrderSuccessComponent } from './pages/components/order-success/order-success.component';
import { DeliveryDetailsComponent } from './pages/homepage/delivery-details/delivery-details.component';
import { LiveOrdersComponent } from './pages/dashboard/live-orders/live-orders.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'cart',
    children: [
      { path: '', pathMatch: 'full', component: CartComponent },
      { path: 'delivery-details', component: DeliveryDetailsComponent },
    ],
  },
  {
    path: 'order-success/:id',
    component: OrderSuccessComponent,
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard(UserRole.KITCHEN_OWNER)],
    children: [
      { path: '', redirectTo: 'kitchen', pathMatch: 'full' },
      { path: 'live-orders', component: LiveOrdersComponent },
      {
        path: 'menu',
        children: [
          { path: '', component: MenuListComponent },
          { path: 'add', component: AddMenuItemComponent },
          { path: 'edit/:id', component: EditMenuItemComponent },
        ],
      },
      { path: 'kitchen', component: KitchenComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
