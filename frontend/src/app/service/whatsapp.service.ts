import { inject, Injectable } from '@angular/core';
import { Order } from '../model/order';
import { KitchenService } from './kitchen.service';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  kitchenService = inject(KitchenService);
  kitchen = this.kitchenService.kitchen;

  generateWhatsAppLink(order: Order): string {
    const itemsList = order.orderItems
      .map(
        (item: any) =>
          `• ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`
      )
      .join('\n');

    const message = [
      `*NEW ORDER RECEIVED!* 🍕`,
      `*Order ID:* #${order.id}`,
      `--------------------------`,
      `*Customer Details:*`,
      `👤 ${order.customerName}`,
      `📍 ${order.customerAddress}`,
      `📞 ${order.customerPhone || 'N/A'}`,
      `\n*Items:*`,
      itemsList,
      `\n*Bill Summary:*`,
      `Subtotal: ₹${order.subtotal || ''}`,
      `Delivery: ₹${order.deliveryFee || '40'}`,
      `*Total Payable: ₹${order.totalAmount}*`,
      `--------------------------`,
      `*Notes:* ${order.specialInstructions || 'NIL'}`,
      `\n👉 Please share the *UPI QR Code* to confirm this order.`,
    ].join('\n');

    const cleanPhone = this.kitchen()?.whatsapp.replace(/\D/g, '');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}
