export interface Booking {
  id: string;
  hostelName: string;
  hostelId: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  amount: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: Date;
}
