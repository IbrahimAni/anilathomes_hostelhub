"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { FiCreditCard, FiDownload, FiExternalLink, FiCheck, FiX, FiClock } from "react-icons/fi";

interface Payment {
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // In a real implementation, we would fetch payments from Firebase
        // For now, using mock data
        const mockPayments: Payment[] = [
          {
            id: 'pay-001',
            hostelName: 'Unilag Female Hostel',
            hostelId: '1',
            bookingId: 'bk-001',
            amount: '₦180,000',
            status: 'successful',
            date: new Date('2023-08-15'),
            paymentMethod: 'Card Payment',
            reference: 'REF-12345678'
          },
          {
            id: 'pay-002',
            hostelName: 'LASU Exclusive Male Hostel',
            hostelId: '2',
            bookingId: 'bk-002',
            amount: '₦75,000',
            status: 'successful',
            date: new Date('2024-05-20'),
            paymentMethod: 'Bank Transfer',
            reference: 'REF-23456789'
          },
          {
            id: 'pay-003',
            hostelName: 'LASU Exclusive Male Hostel',
            hostelId: '2',
            bookingId: 'bk-002',
            amount: '₦75,000',
            status: 'pending',
            date: new Date('2024-06-20'),
            paymentMethod: 'Bank Transfer',
            reference: 'REF-34567890'
          }
        ];

        setPayments(mockPayments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [router]);

  const filteredPayments = activeFilter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === activeFilter);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'successful':
        return (
          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiCheck className="mr-1" />
            Successful
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiClock className="mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiX className="mr-1" />
            Failed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <div className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full flex items-center text-sm">
          <FiCreditCard className="mr-1" />
          <span>{payments.length} Transactions</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setActiveFilter('successful')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'successful'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Successful
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('failed')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'failed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {filteredPayments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
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
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => router.push(`/dashboard/student/bookings?id=${payment.bookingId}`)}
                        >
                          <FiExternalLink className="inline" />
                          <span className="sr-only">View Booking</span>
                        </button>

                        {payment.status === 'successful' && (
                          <button className="text-gray-500 hover:text-gray-700">
                            <FiDownload className="inline" />
                            <span className="sr-only">Download Receipt</span>
                          </button>
                        )}

                        {payment.status === 'pending' && (
                          <button 
                            className="text-yellow-500 hover:text-yellow-700"
                            onClick={() => router.push(`/dashboard/student/payments/verify/${payment.id}`)}
                          >
                            <FiCheck className="inline" />
                            <span className="sr-only">Verify Payment</span>
                          </button>
                        )}

                        {payment.status === 'failed' && (
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => router.push(`/dashboard/student/payments/retry/${payment.id}`)}
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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
          >
            View Bookings
          </button>
        </div>
      )}
    </div>
  );
}