import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { MenuItem } from '../model/menu-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  STORAGE_KEY = 'cart';

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private readonly _cartItems = signal<CartItem[]>(this.loadFromStorage());
  readonly cartItems = this._cartItems.asReadonly();

  readonly totalCount = computed(() =>
    this._cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly isEmpty = computed(() => this._cartItems().length === 0);

  private readonly _animate = signal<{
    x: number;
    y: number;
    imageUrl: string;
  } | null>(null);

  readonly animate = this._animate.asReadonly();

  constructor() {
    effect(() => {
      const items = this._cartItems();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    });
  }

  triggerAnimation(x: number, y: number, imageUrl: string) {
    this._animate.set({ x, y, imageUrl });
  }

  addToCart(item: MenuItem): void {
    this._cartItems.update((items) => {
      const existing = items.find((i) => i.menuItem.id === item.id);

      if (existing) {
        return items.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...items, { menuItem: item, quantity: 1 }];
    });
  }

  removeFromCart(item: MenuItem): void {
    this._cartItems.update((items) => {
      const existing = items.find((i) => i.menuItem.id === item.id);
      if (!existing) return items;

      if (existing.quantity > 1) {
        return items.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }

      return items.filter((i) => i.menuItem.id !== item.id);
    });
  }

  getItemQuantity(itemId: number): number {
    return (
      this._cartItems().find((i) => i.menuItem.id === itemId)?.quantity ?? 0
    );
  }

  clearCart(): void {
    this._cartItems.set([]);
  }
}
