import { inject, Injectable } from '@angular/core';
import { Order, OrderItem } from '../model/order';
import { KitchenService } from './kitchen.service';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  kitchenService = inject(KitchenService);
  kitchen = this.kitchenService.kitchen;

  generateWhatsAppLink(orderData: Order): string {
    const itemsList = orderData.orderItems
      .map(
        (item: OrderItem) =>
          `• ${item.itemName} × ${item.quantity} (₹${
            item.price * item.quantity
          })`,
      )
      .join('\n');

    const taxesAndFees =
      orderData.deliveryFees + orderData.packingCharges + orderData.taxes;
    const message = [
      `*NEW ORDER RECEIVED!* 🍕`,
      `*Order ID:* #${orderData.id}`,
      `--------------------------`,
      `*Customer Details:*`,
      `👤 ${orderData.customerName}`,
      `📍 ${orderData.deliveryAddress}`,
      `📞 ${orderData.customerPhone || 'N/A'}`,
      `\n*Items:*`,
      itemsList,
      `\n*Bill Summary:*`,
      `Subtotal: ₹${orderData.subtotal}`,
      `Taxes & Fees: ₹${taxesAndFees}`,
      `*Total Payable: ₹${orderData.subtotal + taxesAndFees}*`,
      `--------------------------`,
      `*Notes:* ${orderData.specialInstructions || 'NIL'}`,
      `\n👉 Please share the *UPI QR Code* to confirm this order.`,
    ].join('\n');

    const cleanPhone = this.kitchen()?.whatsapp.replace(/\D/g, '');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}
