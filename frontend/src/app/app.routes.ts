import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { kitchenResolver } from './resolvers/kitchen.resolver';

export const routes: Routes = [
  { path: '', component: MenuComponent, resolve: { kitchen: kitchenResolver } },
  { path: 'not-found', component: NotFoundComponent },
];
