export interface User {
  id: number;
  name: string;
  phone: string;
  defaultAddressId: number;
  addresses: Address[];
}

export interface Address {
  id: number;
  streetAddress: string;
  fullAddress: string;
  location: string;
}
