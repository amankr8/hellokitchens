import { Component, computed, inject } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';
import { MenuService } from '../../../service/menu.service';
import { Order } from '../../../model/order';
import { OrderStatus } from '../../../enum/order-status.enum';

@Component({
  selector: 'app-live-orders',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './live-orders.component.html',
})
export class LiveOrdersComponent {
  private orderService = inject(OrderService);
  private menuService = inject(MenuService);
  private uiService = inject(UiService);

  orderStatus = OrderStatus;
  icons = Icons;

  menuItems = this.menuService.menuItems;
  pendingOrders = this.orderService.pendingKitchenOrders;
  preparingOrders = this.orderService.preparingKitchenOrders;
  dispatchedOrders = this.orderService.dispatchedKitchenOrders;
  loading = this.orderService.loading;
  error = this.orderService.error;

  selectedOrderForModal: Order | null = null;

  totalActiveCount = computed(
    () =>
      this.pendingOrders().length +
      this.preparingOrders().length +
      this.dispatchedOrders().length,
  );

  ngOnInit() {
    this.menuService.loadMenuItems();
    this.orderService.loadKitchenOrders();
  }

  refreshOrders() {
    this.orderService.refreshKitchenOrders();
  }

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

  updateStatus(orderId: number, nextStatus: OrderStatus) {
    const notification =
      nextStatus === OrderStatus.DELIVERED
        ? `Order #${orderId} marked as ${nextStatus}`
        : `Order #${orderId} moved to ${nextStatus}`;
    this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: () => this.uiService.showToast(notification),
      error: () =>
        this.uiService.showToast(
          'Failed to update status. Please try again',
          'error',
        ),
    });
  }

  deleteOrder(orderId: number) {
    this.uiService.ask({
      title: `Cancel Order #${orderId}?`,
      message: `Are you sure you want to discard this order? This action cannot be undone.`,
      confirmText: 'Yes, Discard',
      action: () => {
        this.orderService.discardOrder(orderId).subscribe({
          next: () =>
            this.uiService.showToast(`Order #${orderId} was DISCARDED`, 'info'),
          error: () =>
            this.uiService.showToast(
              'Failed to cancel order. Please try again',
              'error',
            ),
        });
      },
    });
  }
}
