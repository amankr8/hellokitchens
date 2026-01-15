export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  subtotal: number;
  packingCharges: number;
  deliveryFee: number;
  totalAmount: number;
  specialInstructions: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  customerDetails: CustomerDetails;
  specialInstructions: string;
  orderItems: OrderItemPayload[];
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItemPayload {
  menuItemId: number;
  quantity: number;
}
