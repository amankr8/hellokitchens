import { AddressPayload, UserPayload } from './user';

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  streetAddress: string;
  deliveryAddress: string;
  location: string;
  status: string;
  subtotal: number;
  packingCharges: number;
  deliveryFees: number;
  taxes: number;
  totalAmount: number;
  notes: string | null;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  itemName: number;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  customerDetails: UserPayload;
  addressDetails: AddressPayload;
  notes: string | null;
  orderItems: OrderItemPayload[];
}

export interface OrderItemPayload {
  menuItemId: number;
  quantity: number;
}
