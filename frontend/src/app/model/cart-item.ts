import { MenuItem } from './menu-item';

export interface Cart {
  notes: string;
  items: CartItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
