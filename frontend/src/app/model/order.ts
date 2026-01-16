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
  customerDetails: CustomerDetails;
  specialInstructions: string | null;
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
