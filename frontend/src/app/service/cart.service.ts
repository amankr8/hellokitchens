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

  private readonly _specialInstructions = signal<string | null>(null);
  readonly specialInstructions = this._specialInstructions.asReadonly();

  private animationQueue = signal<{ x: number; y: number; imageUrl: string }[]>(
    []
  );

  readonly totalCount = computed(() =>
    this._cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly isEmpty = computed(() => this._cartItems().length === 0);

  constructor() {
    effect(() => {
      const items = this._cartItems();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    });
  }

  triggerAnimation(x: number, y: number, imageUrl: string) {
    this.animationQueue.update((q) => [...q, { x, y, imageUrl }]);
  }

  consumeAnimation() {
    const queue = this.animationQueue();
    if (queue.length === 0) return null;

    const [next, ...rest] = queue;
    this.animationQueue.set(rest);
    return next;
  }

  addSpecialInstructions(instructions: string | null) {
    this._specialInstructions.set(instructions);
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
    this._specialInstructions.set(null);
  }
}
