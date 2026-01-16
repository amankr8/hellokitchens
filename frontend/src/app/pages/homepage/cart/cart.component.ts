import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { Router, RouterLink } from '@angular/router';
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
})
export class CartComponent {
  kitchenService = inject(KitchenService);
  cartService = inject(CartService);
  router = inject(Router);

  kitchen = this.kitchenService.kitchen;
  cartItems = this.cartService.cartItems;

  isBillExpanded = signal(false);
  selectedAddressId = signal<number | null>(null);
  editingAddressId = signal<number | null>(null);
  specialInstructions = signal<string | null>(null);

  icons = Icons;

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

  addDeliveryDetails() {
    const specialInstructions = this.specialInstructions();
    this.router.navigate(['/cart/delivery-details'], {
      state: {
        specialInstructions: specialInstructions,
      },
      replaceUrl: true,
    });
  }
}
