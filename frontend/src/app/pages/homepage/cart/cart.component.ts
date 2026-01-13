import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../service/user.service';
import { Icons } from '../../../utils/icons';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { FormsModule } from '@angular/forms';
import { KitchenService } from '../../../service/kitchen.service';
import { APP_NAME } from '../../../constants/app.constant';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FontAwesomeModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  kitchenService = inject(KitchenService);
  userService = inject(UserService);
  cartService = inject(CartService);
  router = inject(Router);

  kitchen = this.kitchenService.kitchen;

  user = this.userService.user;
  selectedAddressId = signal<number | null>(null);
  specialInstructions = signal('');

  cartItems = this.cartService.cartItems;

  icons = Icons;

  constructor() {
    effect(() => {
      const user = this.user();

      if (!user) return;

      this.selectedAddressId.set(user.defaultAddressId);
    });
  }

  ngOnInit() {
    this.userService.loadUser();
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Cart';
  }

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

  placeOrder() {
    this.cartService.clearCart();
    this.router.navigate(['/order-success', 1], { replaceUrl: true });
  }
}
