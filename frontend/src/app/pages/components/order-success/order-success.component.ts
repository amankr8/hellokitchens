import { Component, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../model/order';

import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-order-success',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './order-success.component.html',
})
export class OrderSuccessComponent {
  id = input.required<string>();
  whatsappUrl = signal<string>('');
  orderData = signal<Order | null>(null);

  icons = Icons;

  constructor(private router: Router) {
    const navigation = history.state;
    this.whatsappUrl.set(navigation.whatsappUrl || '');
    this.orderData.set(navigation.orderData || null);
  }

  ngOnInit() {
    this.launchConfetti();
    document.title = 'Thank you for ordering with us!';
  }

  launchConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti.default({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EA580C', '#FBBF24'], // Our brand colors (Orange & Gold)
      });
      confetti.default({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#25D366', '#FBBF24'], // WhatsApp Green & Gold
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }
}
