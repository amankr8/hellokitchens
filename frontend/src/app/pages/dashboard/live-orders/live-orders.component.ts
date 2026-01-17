import { Component, computed, inject } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';
import { MenuService } from '../../../service/menu.service';

@Component({
  selector: 'app-live-orders',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './live-orders.component.html',
})
export class LiveOrdersComponent {
  orderService = inject(OrderService);
  menuService = inject(MenuService);
  uiService = inject(UiService);
  icons = Icons;

  menuItems = this.menuService.menuItems;
  pendingOrders = this.orderService.pendingOrders;
  preparingOrders = this.orderService.preparingOrders;
  dispatchedOrders = this.orderService.dispatchedOrders;

  ngOnInit() {
    this.menuService.loadMenuItems();
    this.orderService.loadOrders();
  }

  updateStatus(orderId: number, nextStatus: string) {
    console.log(`Updating ${orderId} to ${nextStatus}`);
    this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: () =>
        this.uiService.showToast(`Order #${orderId} moved to ${nextStatus}`),
      error: () =>
        this.uiService.showToast('Failed to update order status', 'error'),
    });
  }
}
