import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../service/order.service';
import { Icons } from '../../../../utils/icons';
import { WhatsappService } from '../../../../service/whatsapp.service';
import { Order } from '../../../../model/order';

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

  onSendToWhatsApp(order: Order) {
    const url = this.whatsappService.generateWhatsAppLink(order);
    window.location.href = url;
  }
}
