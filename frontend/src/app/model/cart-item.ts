import { MenuItem } from './menu-item';

export interface Cart {
  notes: string | null;
  items: CartEntry[];
}

export interface CartEntry {
  menuItemId: number;
  quantity: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
