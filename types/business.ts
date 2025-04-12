// Business dashboard related types

// Business Profile types
export interface BusinessProfileData {
  businessName: string;
  registrationNumber: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  foundedYear?: string;
  logoUrl?: string;
  acceptedTerms: boolean;
}

// Dashboard statistics types
export interface StatData {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: string;
  testId?: string;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface ChartProps {
  title: string;
  subtitle?: string;
  type: 'line' | 'bar';
  data: ChartData;
  height?: number;
  testId?: string;
}

// Property types
export interface PropertyData {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  occupancyRate: number;
  bookings: number;
  testId?: string;
}

// Room occupancy types
export interface RoomOccupant {
  id: string;
  name: string;
  leaseEnd: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  agentAssisted: boolean;
  agentName?: string;
}

export interface RoomData {
  roomId: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  occupiedCount: number;
  occupants: RoomOccupant[];
}

// Booking types
export interface BookingData {
  id: string;
  studentName: string;
  hostelName: string;
  date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Agent commission types
export interface AgentBooking {
  id: string;
  hostelName: string;
  roomNumber: string;
  studentName: string;
  bookingDate: string;
  amount: number;
  commissionAmount: number;
  commissionStatus: 'paid' | 'pending';
}

export interface AgentCommissionData {
  agentId: string;
  agentName: string;
  profileImage: string;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  bookingsCount: number;
  lastBookingDate: string;
  bookings: AgentBooking[];
}