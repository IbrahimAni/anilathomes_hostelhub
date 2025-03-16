import { Booking } from "@/types/booking";

interface PaymentBadgeProps {
  status: Booking['paymentStatus'];
}

export default function PaymentBadge({ status }: PaymentBadgeProps) {
  switch (status) {
    case 'paid':
      return (
        <span 
          data-testid="payment-badge-paid"
          className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm"
        >
          Paid
        </span>
      );
    case 'pending':
      return (
        <span 
          data-testid="payment-badge-pending"
          className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm"
        >
          Pending
        </span>
      );
    case 'failed':
      return (
        <span 
          data-testid="payment-badge-failed"
          className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm"
        >
          Failed
        </span>
      );
  }
}
