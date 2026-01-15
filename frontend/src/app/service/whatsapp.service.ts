import { inject, Injectable } from '@angular/core';
import { Order } from '../model/order';
import { KitchenService } from './kitchen.service';
import { CartItem } from '../model/cart-item';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  kitchenService = inject(KitchenService);
  kitchen = this.kitchenService.kitchen;

  generateWhatsAppLink(cartItems: CartItem[], orderData: Order): string {
    const itemsList = cartItems
      .map(
        (item: CartItem) =>
          `• ${item.menuItem.name} x ${item.quantity} (₹${
            item.menuItem.price * item.quantity
          })`
      )
      .join('\n');

    const message = [
      `*NEW ORDER RECEIVED!* 🍕`,
      `*Order ID:* #${orderData.id}`,
      `--------------------------`,
      `*Customer Details:*`,
      `👤 ${orderData.customerName}`,
      `📍 ${orderData.customerAddress}`,
      `📞 ${orderData.customerPhone || 'N/A'}`,
      `\n*Items:*`,
      itemsList,
      `\n*Bill Summary:*`,
      `Subtotal: ₹${orderData.totalAmount || ''}`,
      `Taxes & Fees: ₹${orderData.deliveryFee || '45'}`,
      `*Total Payable: ₹${orderData.totalAmount + 45}*`,
      `--------------------------`,
      `*Notes:* ${orderData.specialInstructions || 'NIL'}`,
      `\n👉 Please share the *UPI QR Code* to confirm this order.`,
    ].join('\n');

    const cleanPhone = this.kitchen()?.whatsapp.replace(/\D/g, '');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}
