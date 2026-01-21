import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../service/order.service';
import { Icons } from '../../../../utils/icons';
import { WhatsappService } from '../../../../service/whatsapp.service';
import { Order } from '../../../../model/order';

interface OrderGroup {
  label: string;
  orders: Order[];
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private whatsappService = inject(WhatsappService);
  location = inject(Location);

  orders = this.orderService.userOrders;
  loading = this.orderService.loading;
  error = this.orderService.error;
  icons = Icons;

  ngOnInit() {
    this.orderService.loadUserOrders();
  }

  refreshOrders() {
    this.orderService.refreshUserOrders();
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-600';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-600';
      case 'DISPATCHED':
        return 'bg-green-100 text-green-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  groupedOrders = computed(() => {
    const rawOrders = this.orders() || [];

    // Sort by timestamp descending (newest first)
    const sorted = [...rawOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const groups: OrderGroup[] = [];
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    sorted.forEach((order) => {
      const orderDate = new Date(order.createdAt).toDateString();
      let label = '';

      if (orderDate === today) label = 'Today';
      else if (orderDate === yesterdayStr) label = 'Yesterday';
      else
        label = new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, orders: [] };
        groups.push(group);
      }
      group.orders.push(order);
    });

    return groups;
  });

  onSendToWhatsApp(order: Order) {
    const url = this.whatsappService.generateWhatsAppLink(order);
    window.location.href = url;
  }
}
