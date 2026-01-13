export interface Order {}

export interface OrderPayload {
  userDetails: CustomerDetails;
  specialInstructions: string;
  orderItems: [OrderItemPayload];
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
