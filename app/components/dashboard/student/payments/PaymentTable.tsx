import { useRouter } from "next/navigation";
import { FiCheck, FiDownload, FiExternalLink } from "react-icons/fi";
import { Payment } from "@/app/types/payment";
import { formatDate } from "@/app/utils/payments";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentTableProps {
  payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden" data-testid="payment-table">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hostel
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50" data-testid={`payment-row-${payment.id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.hostelName}</div>
                  <div className="text-sm text-gray-500">Booking ID: {payment.bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => router.push(`/dashboard/student/bookings?id=${payment.bookingId}`)}
                      data-testid={`view-booking-${payment.id}`}
                    >
                      <FiExternalLink className="inline" />
                      <span className="sr-only">View Booking</span>
                    </button>

                    {payment.status === 'successful' && (
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        data-testid={`download-receipt-${payment.id}`}
                      >
                        <FiDownload className="inline" />
                        <span className="sr-only">Download Receipt</span>
                      </button>
                    )}

                    {payment.status === 'pending' && (
                      <button 
                        className="text-yellow-500 hover:text-yellow-700"
                        onClick={() => router.push(`/dashboard/student/payments/verify/${payment.id}`)}
                        data-testid={`verify-payment-${payment.id}`}
                      >
                        <FiCheck className="inline" />
                        <span className="sr-only">Verify Payment</span>
                      </button>
                    )}

                    {payment.status === 'failed' && (
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => router.push(`/dashboard/student/payments/retry/${payment.id}`)}
                        data-testid={`retry-payment-${payment.id}`}
                      >
                        <span className="sr-only">Retry Payment</span>
                        Retry
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
