import { Component, computed, inject } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-live-orders',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './live-orders.component.html',
})
export class LiveOrdersComponent {
  orderService = inject(OrderService);
  icons = Icons;

  pendingOrders = computed(
    () =>
      this.orderService.orders()?.filter((o) => o.status === 'PENDING') ?? [],
  );

  preparingOrders = computed(
    () =>
      this.orderService.orders()?.filter((o) => o.status === 'PREPARING') ?? [],
  );

  dispatchedOrders = computed(
    () =>
      this.orderService.orders()?.filter((o) => o.status === 'DISPATCHED') ??
      [],
  );

  ngOnInit() {
    this.orderService.refreshOrders();
  }

  updateStatus(orderId: number, nextStatus: string) {
    console.log(`Updating ${orderId} to ${nextStatus}`);
    this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: () => console.log('Order updated'),
      error: () => console.error('Failed'),
    });
  }
}
