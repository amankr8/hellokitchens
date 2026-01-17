import { AddressPayload, UserPayload } from './user';

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: string;
  subtotal: number;
  packingCharges: number;
  deliveryFees: number;
  taxes: number;
  totalAmount: number;
  specialInstructions: string | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  customerDetails: UserPayload;
  addressDetails: AddressPayload;
  specialInstructions: string | null;
  orderItems: OrderItemPayload[];
}

export interface OrderItemPayload {
  menuItemId: number;
  quantity: number;
}
