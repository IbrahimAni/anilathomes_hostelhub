import { useRouter } from "next/navigation";
import { FiCreditCard } from "react-icons/fi";
import { PaymentFilterType } from "@/app/types/payment";

interface EmptyPaymentStateProps {
  activeFilter: PaymentFilterType;
}

export default function EmptyPaymentState({ activeFilter }: EmptyPaymentStateProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center" data-testid="empty-payment-state">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <FiCreditCard className="text-blue-500" size={24} />
      </div>
      <h2 className="text-xl font-semibold mt-4">No payments found</h2>
      <p className="text-gray-600 mt-2">
        {activeFilter === 'all' 
          ? "You haven't made any payments yet."
          : `You don't have any ${activeFilter} payments.`}
      </p>
      <button
        onClick={() => router.push('/dashboard/student/bookings')}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        data-testid="view-bookings-button"
      >
        View Bookings
      </button>
    </div>
  );
}
