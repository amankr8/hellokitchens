import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Cart, CartEntry, CartItem } from '../model/cart-item';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'cartV2';

  private menuService = inject(MenuService);
  private readonly _menuItems = this.menuService.menuItems;

  private loadFromStorage(): Cart {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Cart) : { notes: null, items: [] };
    } catch {
      return { notes: null, items: [] };
    }
  }

  private readonly _cartEntries = signal<CartEntry[]>(
    this.loadFromStorage().items,
  );
  readonly cartEntries = this._cartEntries.asReadonly();

  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  private readonly _notes = signal<string | null>(this.loadFromStorage().notes);
  readonly notes = this._notes.asReadonly();

  private animationQueue = signal<{ x: number; y: number; imageUrl: string }[]>(
    [],
  );

  readonly totalCount = computed(() =>
    this._cartEntries().reduce((acc, item) => acc + item.quantity, 0),
  );

  readonly isEmpty = computed(() => this._cartEntries().length === 0);

  constructor() {
    effect(() => {
      const notes = this._notes();
      const itemEntries = this._cartEntries();
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({ notes, items: itemEntries }),
      );
    });

    effect(() => {
      const menuItems = this._menuItems();
      if (!menuItems) {
        this._cartItems.set([]);
        return;
      }

      const entries = this._cartEntries();
      const items: CartItem[] = [];
      for (const entry of entries) {
        const menuItem = menuItems.find((mi) => mi.id === entry.menuItemId);
        if (menuItem) {
          items.push({ menuItem, quantity: entry.quantity });
        }
      }
      this._cartItems.set(items);
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

  setNotes(notes: string | null) {
    this._notes.set(notes);
  }

  addToCart(itemId: number): void {
    this._cartEntries.update((entries) => {
      const existing = entries.find((i) => i.menuItemId === itemId);

      if (existing) {
        return entries.map((i) =>
          i.menuItemId === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...entries, { menuItemId: itemId, quantity: 1 }];
    });
  }

  removeFromCart(itemId: number): void {
    this._cartEntries.update((entries) => {
      const existing = entries.find((i) => i.menuItemId === itemId);
      if (!existing) return entries;

      if (existing.quantity > 1) {
        return entries.map((i) =>
          i.menuItemId === itemId ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }

      return entries.filter((i) => i.menuItemId !== itemId);
    });
  }

  getItemQuantity(itemId: number): number {
    return (
      this._cartEntries().find((i) => i.menuItemId === itemId)?.quantity ?? 0
    );
  }

  clearCart(): void {
    this._cartEntries.set([]);
    this._cartItems.set([]);
    this._notes.set(null);
  }
}
