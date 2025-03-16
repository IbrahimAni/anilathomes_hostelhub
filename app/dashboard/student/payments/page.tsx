"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { Payment, PaymentFilterType } from "@/app/types/payment";

// Components
import PaymentHeader from "@/app/components/dashboard/student/payments/PaymentHeader";
import PaymentFilterTabs from "@/app/components/dashboard/student/payments/PaymentFilterTabs";
import PaymentTable from "@/app/components/dashboard/student/payments/PaymentTable";
import EmptyPaymentState from "@/app/components/dashboard/student/payments/EmptyPaymentState";
import LoadingState from "@/app/components/dashboard/student/payments/LoadingState";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeFilter, setActiveFilter] = useState<PaymentFilterType>('all');
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

        // In the future, we will fetch payments from Firestore here
        // For now, initializing with empty array
        setPayments([]);
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

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8" data-testid="payments-page">
      <PaymentHeader transactionCount={payments.length} />
      <PaymentFilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      
      {filteredPayments.length > 0 ? (
        <PaymentTable payments={filteredPayments} />
      ) : (
        <EmptyPaymentState activeFilter={activeFilter} />
      )}
    </div>
  );
}