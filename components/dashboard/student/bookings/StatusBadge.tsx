import { FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { Booking } from "@/types/booking";

interface StatusBadgeProps {
  status: Booking['status'];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <span 
          data-testid="status-badge-active"
          className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center"
        >
          <FiCheckCircle className="mr-1" />
          Active
        </span>
      );
    case 'upcoming':
      return (
        <span 
          data-testid="status-badge-upcoming"
          className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm flex items-center"
        >
          <FiClock className="mr-1" />
          Upcoming
        </span>
      );
    case 'completed':
      return (
        <span 
          data-testid="status-badge-completed"
          className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm flex items-center"
        >
          <FiCheckCircle className="mr-1" />
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span 
          data-testid="status-badge-cancelled"
          className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm flex items-center"
        >
          <FiAlertCircle className="mr-1" />
          Cancelled
        </span>
      );
  }
}
