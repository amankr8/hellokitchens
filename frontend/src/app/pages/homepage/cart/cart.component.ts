import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { FormsModule } from '@angular/forms';
import { KitchenService } from '../../../service/kitchen.service';
import { APP_NAME } from '../../../constants/app.constant';
import { EmptyCartComponent } from '../../components/empty-cart/empty-cart.component';
import { CartItem } from '../../../model/cart-item';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    FormsModule,
    EmptyCartComponent,
  ],
  templateUrl: './cart.component.html',
  styles: [
    `
      :host {
        overscroll-behavior-y: contain;
      }
    `,
  ],
})
export class CartComponent {
  kitchenService = inject(KitchenService);
  cartService = inject(CartService);

  kitchen = this.kitchenService.kitchen;
  cartItems = this.cartService.cartItems;

  isBillExpanded = signal(false);
  notes = signal('');
  isEditingNotes = signal(false);

  icons = Icons;

  constructor() {
    effect(() => {
      const specialInstructions = this.cartService.notes();
      if (!specialInstructions) return;

      this.notes.set(specialInstructions);
    });
  }

  ngOnInit() {
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Cart';
  }

  increaseQty(item: CartItem) {
    this.cartService.addToCart(item.menuItem);
  }

  decreaseQty(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem);
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
      0
    )
  );

  deliveryFee = signal(40);
  packingCharge = signal(15);

  totalAmount = computed(
    () => this.subtotal() + this.deliveryFee() + this.packingCharge()
  );
}
