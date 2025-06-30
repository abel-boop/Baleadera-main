export type TShirtSize = 'S' | 'M' | 'L' | 'XL';
export type TShirtOrderStatus = 'pending' | 'verified' | 'cancelled';

export interface TShirtOrder {
  id: string;
  registration_id: string;
  edition_id: number;
  size: TShirtSize;
  quantity: number;
  payment_reference: string;
  status: TShirtOrderStatus;
  created_at: string;
  updated_at: string;
}

export interface TShirtOrderCreate {
  registration_id: string;
  edition_id: number;
  size: TShirtSize;
  quantity: number;
  payment_reference: string;
}

export interface TShirtOrderUpdate {
  status?: TShirtOrderStatus;
}
