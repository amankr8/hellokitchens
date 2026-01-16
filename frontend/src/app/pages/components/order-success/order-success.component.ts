import { Component, computed, inject, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { RouterLink } from '@angular/router';
import { Order } from '../../../model/order';

import * as confetti from 'canvas-confetti';
import { CartItem } from '../../../model/cart-item';
import { WhatsappService } from '../../../service/whatsapp.service';

@Component({
  selector: 'app-order-success',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './order-success.component.html',
})
export class OrderSuccessComponent {
  private whatsappService = inject(WhatsappService);

  id = input.required<string>();
  whatsappUrl = signal<string>('');
  orderData = signal<Order | null>(null);
  cartItems = signal<CartItem[]>([]);

  icons = Icons;

  constructor() {
    const navigation = history.state;
    this.cartItems.set(navigation.cartItems || null);
    this.orderData.set(navigation.orderData || null);

    const cartItems = this.cartItems();
    const orderData = this.orderData();
    if (cartItems && orderData) {
      this.whatsappUrl.set(
        this.whatsappService.generateWhatsAppLink(cartItems, orderData)
      );
    }
  }

  ngOnInit() {
    this.launchConfetti();
    document.title = 'Thank you for ordering with us!';
  }

  taxesAndFees = computed(
    () =>
      (this.orderData()?.packingCharges ?? 0) +
      (this.orderData()?.deliveryFees ?? 0) +
      (this.orderData()?.taxes ?? 0)
  );

  launchConfetti() {
    const duration = 1 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti.default({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EA580C', '#FBBF24'],
      });
      confetti.default({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#25D366', '#FBBF24'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }
}
