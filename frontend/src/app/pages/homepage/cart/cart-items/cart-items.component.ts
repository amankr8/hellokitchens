import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../../../service/cart.service';
import { CartItem } from '../../../../model/cart-item';
import { Icons } from '../../../../utils/icons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-items',
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterLink],
  templateUrl: './cart-items.component.html',
})
export class CartItemsComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;

  isBillExpanded = signal(false);
  notes = signal('');
  isEditingNotes = signal(false);

  icons = Icons;

  defaultImage: string = 'images/dish.png';

  constructor() {
    effect(() => {
      const specialInstructions = this.cartService.notes();
      if (!specialInstructions) return;

      this.notes.set(specialInstructions);
    });
  }

  increaseQty(item: CartItem) {
    this.cartService.addToCart(item.menuItem);
  }

  decreaseQty(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem);
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  toggleBill() {
    this.isBillExpanded.update((val) => !val);
  }

  startEditingNotes() {
    this.isEditingNotes.set(true);
  }

  saveNotes() {
    const instructions = this.notes();
    if (instructions.trim().length > 0) {
      this.cartService.setNotes(instructions);
      this.isEditingNotes.set(false);
    }
  }

  deleteNotes() {
    this.notes.set('');
    this.cartService.setNotes(null);
    this.isEditingNotes.set(false);
  }

  subtotal = computed(() =>
    this.cartItems().reduce(
      (acc, item) => acc + item.menuItem.price * item.quantity,
      0,
    ),
  );

  deliveryFee = signal(40);
  packingCharge = signal(15);

  totalAmount = computed(
    () => this.subtotal() + this.deliveryFee() + this.packingCharge(),
  );
}
