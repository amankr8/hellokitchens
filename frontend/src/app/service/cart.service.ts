import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from '../model/menu-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  itemQuantity(itemId: number) {
    return computed(
      () =>
        this._cartItems().find((i) => i.menuItem.id === itemId)?.quantity ?? 0
    );
  }

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

  triggerAnimation(x: number, y: number, imageUrl: string) {
    this._animate.set({ x, y, imageUrl });

    queueMicrotask(() => this._animate.set(null));
  }

  addToCart(item: MenuItem) {
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

  removeFromCart(item: MenuItem) {
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

  clearCart(): void {
    this._cartItems.set([]);
  }
}
