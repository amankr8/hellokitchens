import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from '../model/menu';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  private animateSubject = new Subject<{
    x: number;
    y: number;
    imageUrl: string;
  }>();
  animate$ = this.animateSubject.asObservable();
  cart$ = this.cartSubject.asObservable();

  triggerAnimation(x: number, y: number, imageUrl: string) {
    this.animateSubject.next({ x, y, imageUrl });
  }

  addToCart(item: MenuItem) {
    const existingItem = this.cartItems.find((i) => i.menuItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ menuItem: item, quantity: 1 });
    }

    this.cartSubject.next([...this.cartItems]);
  }

  getTotalCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next([]);
  }
}
