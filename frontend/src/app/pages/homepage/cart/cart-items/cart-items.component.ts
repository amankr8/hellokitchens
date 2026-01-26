import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../../../service/cart.service';
import { CartItem } from '../../../../model/cart-item';
import { Icons } from '../../../../utils/icons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../../service/menu.service';

@Component({
  selector: 'app-cart-items',
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterLink],
  templateUrl: './cart-items.component.html',
})
export class CartItemsComponent {
  cartService = inject(CartService);
  menuService = inject(MenuService);

  cartItems = this.cartService.cartItems;
  loading = this.menuService.loading;
  error = this.menuService.error;

  isBillExpanded = signal(false);
  notes = signal('');
  isEditingNotes = signal(false);

  icons = Icons;

  defaultImage: string = 'images/dish.png';

  constructor() {
    effect(() => {
      const notes = this.cartService.notes();
      if (!notes) return;

      this.notes.set(notes);
    });
  }

  ngOnInit() {
    this.menuService.loadMenuItems();
  }

  increaseQty(item: CartItem) {
    this.cartService.addToCart(item.menuItem.id);
  }

  decreaseQty(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem.id);
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
    const notes = this.notes();
    if (notes.trim().length > 0) {
      this.cartService.setNotes(notes);
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
