import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../service/user.service';
import { Icons } from '../../../utils/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  userService = inject(UserService);

  user = this.userService.user;
  selectedAddressId = signal<number | null>(null);

  // Assuming you have a cart items signal
  cartItems = signal<any[]>([]);

  subtotal = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  deliveryFee = signal(40); // Fixed or calculated
  platformFee = signal(5);

  totalAmount = computed(
    () => this.subtotal() + this.deliveryFee() + this.platformFee()
  );

  icons = Icons;

  ngOnInit() {
    // this.userService.loadUser();
    if (this.user()?.defaultAddressId) {
      this.selectedAddressId.set(this.user()?.defaultAddressId ?? null);
    }
  }
}
