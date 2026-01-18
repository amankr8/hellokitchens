import { Component, computed, inject } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';
import { MenuService } from '../../../service/menu.service';
import { Order } from '../../../model/order';

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

  totalActiveCount = computed(
    () =>
      this.pendingOrders().length +
      this.preparingOrders().length +
      this.dispatchedOrders().length,
  );

  ngOnInit() {
    this.menuService.loadMenuItems();
    this.orderService.loadOrders();
  }
  selectedOrderForModal: Order | null = null;

  openDeliveryModal(order: Order) {
    this.selectedOrderForModal = order;
  }

  closeModal() {
    this.selectedOrderForModal = null;
  }

  copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).then(
      () => {
        this.uiService.showToast('Copied to clipboard!');
      },
      (err) => {
        this.uiService.showToast('Could not copy', 'error');
      },
    );
  }

  showSuccess(btn: HTMLButtonElement) {
    btn.setAttribute('data-copied', 'true');
    setTimeout(() => {
      btn.setAttribute('data-copied', 'false');
    }, 2000);
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

  deleteOrder(orderId: number) {}
}
