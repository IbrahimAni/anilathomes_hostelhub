import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard } from "react-icons/fi";
import { PaymentService, UpcomingPayment } from "@/services/payment.service";

interface UpcomingPaymentsProps {
  limit?: number;
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ limit = 2 }) => {
  const [payments, setPayments] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const upcomingPayments = await PaymentService.getUpcomingPayments(limit);
        setPayments(upcomingPayments);
      } catch (error) {
        console.error("Error fetching upcoming payments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [limit]);

  const handlePayNow = (paymentId: string) => {
    router.push(`/dashboard/student/payments/pay/${paymentId}`);
  };
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const hasPayments = payments.length > 0;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full" data-testid="upcoming-payments-section">
      <h2 className="text-xl font-semibold mb-6">Upcoming Payments</h2>
      {hasPayments ? (
        <div className="space-y-4" data-testid="payments-list">
          {payments.map((payment) => (
            <div 
              key={payment.id} 
              className={`border-l-4 p-4 rounded-lg ${
                payment.isPriority 
                  ? "border-orange-500 bg-orange-50" 
                  : "border-gray-400 bg-gray-50"
              }`} 
              data-testid={`payment-item-${payment.id}`}
            >
              <p className="font-medium">{payment.title}</p>
              <p className="text-sm text-gray-600 mb-2">Due in {payment.dueIn}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">{payment.amount}</span>
                <button 
                  className={`text-sm px-3 py-1 rounded-lg text-white ${
                    payment.isPriority 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                  data-testid={`pay-now-button-${payment.id}`}
                  onClick={() => handlePayNow(payment.id)}
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10" data-testid="no-payments">
          <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
            <FiCreditCard className="text-gray-400" size={28} />
          </div>
          <p className="text-gray-500 mb-2">No upcoming payments</p>
          <p className="text-sm text-gray-400">
            Payments will appear here after booking a hostel
          </p>
        </div>
      )}
    </div>
  );
};