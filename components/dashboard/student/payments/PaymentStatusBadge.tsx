import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { Payment } from "@/app/types/payment";

interface PaymentStatusBadgeProps {
  status: Payment['status'];
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  switch (status) {
    case 'successful':
      return (
        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center" data-testid="status-successful">
          <FiCheck className="mr-1" />
          Successful
        </span>
      );
    case 'pending':
      return (
        <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm flex items-center" data-testid="status-pending">
          <FiClock className="mr-1" />
          Pending
        </span>
      );
    case 'failed':
      return (
        <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm flex items-center" data-testid="status-failed">
          <FiX className="mr-1" />
          Failed
        </span>
      );
  }
}
