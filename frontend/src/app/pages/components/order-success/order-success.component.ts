import { Component, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../model/order';

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
    document.title = 'Thank you for ordering with us!';
  }
}
