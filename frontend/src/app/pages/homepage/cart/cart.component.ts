import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../service/user.service';
import { Icons } from '../../../utils/icons';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KitchenService } from '../../../service/kitchen.service';
import { APP_NAME } from '../../../constants/app.constant';
import { OrderService } from '../../../service/order.service';
import { UiService } from '../../../service/ui.service';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  kitchenService = inject(KitchenService);
  userService = inject(UserService);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  uiService = inject(UiService);
  private fb = inject(FormBuilder);

  kitchen = this.kitchenService.kitchen;
  user = this.userService.user;
  cartItems = this.cartService.cartItems;

  selectedAddressId = signal<number | null>(null);
  specialInstructions = signal('');
  isPlacingOrder = signal(false);

  icons = Icons;

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    address: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) return;

      this.userForm.patchValue({
        name: user.name,
        phone: user.phone,
      });

      if (user.defaultAddressId) {
        this.selectedAddressId.set(user.defaultAddressId);
        const defaultAddr = user.addresses.find(
          (a: any) => a.id === user.defaultAddressId
        );
        if (defaultAddr) {
          this.userForm.patchValue({ address: defaultAddr.address });
        }
      }
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

  selectAddress(addr: any) {
    this.selectedAddressId.set(addr.id);
    this.userForm.patchValue({ address: addr.address });
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
    if (
      this.userForm.invalid ||
      this.cartItems().length === 0 ||
      this.isPlacingOrder()
    ) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isPlacingOrder.set(true);

    const payload = {
      userDetails: this.userForm.value,
      specialInstructions: this.specialInstructions(),
      orderItems: this.cartItems().map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success', order.id], {
          replaceUrl: true,
        });
      },
      error: (err) => {
        console.error('Order failed', err);
        this.isPlacingOrder.set(false);
        this.uiService.showToast('Some error occurred. Please try again.');
      },
    });
  }
}
