export interface Payment {
  id: string;
  hostelName: string;
  hostelId: string;
  bookingId: string;
  amount: string;
  status: 'successful' | 'pending' | 'failed';
  date: Date;
  paymentMethod: string;
  reference: string;
}

export type PaymentFilterType = 'all' | 'successful' | 'pending' | 'failed';
