export interface User {
  id: number;
  name: string;
  phone: string;
  defaultAddressId: number;
  addresses: Profile[];
}

export interface Profile {
  id: number;
  address: string;
}
