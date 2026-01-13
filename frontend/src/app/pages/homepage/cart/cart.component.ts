import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../service/user.service';
import { Icons } from '../../../utils/icons';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FontAwesomeModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  userService = inject(UserService);
  cartService = inject(CartService);

  user = this.userService.user;
  selectedAddressId = signal<number | null>(null);
  specialInstructions = signal('');

  cartItems = this.cartService.cartItems;

  increaseQty(item: any) {
    this.cartService.addToCart(item.menuItem);
  }

  decreaseQty(item: any) {
    this.cartService.removeFromCart(item.menuItem);
  }

  subtotal = computed(() =>
    this.cartItems().reduce(
      (acc, item) => acc + item.menuItem.price * item.quantity,
      0
    )
  );

  deliveryFee = signal(40);
  platformFee = signal(5);

  totalAmount = computed(
    () => this.subtotal() + this.deliveryFee() + this.platformFee()
  );

  icons = Icons;

  ngOnInit() {
    this.userService.loadUser();
    if (this.user()?.defaultAddressId) {
      this.selectedAddressId.set(this.user()?.defaultAddressId ?? null);
    }
  }
}
