"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { BusinessService } from "@/services/business.service";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
} from "firebase/firestore";

// Define Transaction type for financial transactions
interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'commission';
  amount: number;
  date: string;
  status: 'successful' | 'pending' | 'failed';
  studentName?: string;
  agentName?: string;
  hostelName: string;
}

export default function BusinessFinancesPage() {
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: "₦0",
    pendingPayments: "₦0",
    projectedRevenue: "₦0",
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  // Wrap fetchRecentTransactions in useCallback to prevent recreation on each render
  const fetchRecentTransactions = useCallback(async (businessId: string) => {
    try {
      // Get payments received by the business
      const paymentsRef = collection(db, "payments");
      const paymentsQuery = query(
        paymentsRef,
        where("businessId", "==", businessId),
        orderBy("date", "desc"),
        limit(10)
      );
      
      const paymentsSnapshot = await getDocs(paymentsQuery);
      
      const transactions: Transaction[] = [];
      
      // Process payment transactions
      paymentsSnapshot.forEach(doc => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: data.refund ? 'refund' : 'payment',
          amount: data.refund ? -Number(data.amount) : Number(data.amount),
          date: formatDate(data.date.toDate()),
          status: data.status,
          studentName: data.studentName,
          hostelName: data.hostelName
        });
      });
      
      // Get commission payments to agents
      const commissionsRef = collection(db, "commissions");
      const commissionsQuery = query(
        commissionsRef,
        where("businessId", "==", businessId),
        orderBy("date", "desc"),
        limit(5)
      );
      
      const commissionsSnapshot = await getDocs(commissionsQuery);
      
      // Process commission transactions
      commissionsSnapshot.forEach(doc => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: 'commission',
          amount: -Number(data.amount), // Negative amount since it's an outgoing payment
          date: formatDate(data.date.toDate()),
          status: data.status,
          agentName: data.agentName,
          hostelName: data.hostelName
        });
      });
      
      // Sort all transactions by date (most recent first)
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Limit to 5 most recent transactions
      setRecentTransactions(transactions.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  }, []);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // Fetch dashboard statistics for financial data
        const stats = await BusinessService.getDashboardStats();
        setRevenueStats({
          totalRevenue: stats.totalRevenue,
          pendingPayments: stats.pendingPayments,
          projectedRevenue: stats.projectedRevenue,
        });

        // Fetch yearly revenue data
        await fetchYearlyRevenueData(currentUser.uid);

        // Fetch recent transactions
        await fetchRecentTransactions(currentUser.uid);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [router, fetchRecentTransactions]); // Added fetchRecentTransactions as dependency

  // Fetch yearly revenue data from Firestore
  const fetchYearlyRevenueData = async (businessId: string) => {
    try {
      const revenueRef = collection(db, "businessRevenueByMonth");
      const q = query(
        revenueRef,
        where("businessId", "==", businessId),
        where("year", "==", new Date().getFullYear()),
        orderBy("month", "asc")
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // No data available - keep default zeroes
        return;
      }
      
      // Process the monthly revenue data
      const monthlyData = Array(12).fill(0); // Start with zeroes for all months
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const monthIndex = data.month - 1; // Adjust for 0-based array indexing
        
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex] = data.amount || 0;
        }
      });
      
      // Note: We're not updating any state here since we removed the yearlyRevenueData state
      // This function still processes the data but doesn't update state
      // In a real implementation, we would update chart data here
    } catch (error) {
      console.error("Error fetching yearly revenue data:", error);
    }
  };

  // Helper function to format dates consistently
  const formatDate = (date: Date): string => {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD format
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]" data-testid="loading-spinner">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid="business-finances-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Management</h1>
        <p className="text-gray-600">Track your revenue, pending payments, and financial performance.</p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" data-testid="total-revenue-card">
          <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.totalRevenue}</p>
          <div className="mt-2 text-xs text-green-600">
            <span className="inline-block mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0112 7z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            8.2% from last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" data-testid="pending-payments-card">
          <h2 className="text-sm font-medium text-gray-500">Pending Payments</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.pendingPayments}</p>
          <div className="mt-2 text-xs text-amber-600">
            <span className="inline-block mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            15% of total expected
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" data-testid="projected-revenue-card">
          <h2 className="text-sm font-medium text-gray-500">Projected Annual Revenue</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.projectedRevenue}</p>
          <div className="mt-2 text-xs text-indigo-600">
            Based on current occupancy rate
          </div>
        </div>
      </div>

      {/* Revenue Chart and Transaction List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm" data-testid="revenue-chart">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends (2025)</h2>
          <div className="h-80">
            {/* In a real implementation, we would render a chart here using Chart.js or similar */}
            <div className="h-full flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Revenue chart visualization would appear here</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm" data-testid="recent-transactions">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[350px]">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50" data-testid={`transaction-${transaction.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'payment' ? 'Payment Received' :
                           transaction.type === 'refund' ? 'Refund Issued' : 'Commission Paid'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.type !== 'commission' 
                            ? `${transaction.studentName || 'Unknown'} - ${transaction.hostelName}` 
                            : `Agent: ${transaction.agentName || 'Unknown'}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'successful' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`} data-testid={`transaction-status-${transaction.id}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center" data-testid="no-transactions">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No recent financial transactions to display.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center cursor-pointer" data-testid="generate-report-action">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Generate Financial Report</h3>
            <p className="text-xs text-green-600 mt-1">Export monthly or yearly reports</p>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center cursor-pointer" data-testid="payment-records-action">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Payment Records</h3>
            <p className="text-xs text-indigo-600 mt-1">View detailed payment history</p>
          </div>
        </div>
      </div>
    </div>
  );
}