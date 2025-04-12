import { auth } from "@/config/firebase";
import { collection, query, where, orderBy, limit as limitQuery, getDocs, addDoc, getFirestore, Timestamp, updateDoc, doc } from "firebase/firestore";

export interface Payment {
  id: string;
  hostelName: string;
  hostelId: string;
  bookingId: string;
  amount: string;
  status: 'successful' | 'pending' | 'failed';
  date: Date;
  paymentMethod: string;
  reference: string;
  userId: string;
}

export interface UpcomingPayment {
  id: string;
  title: string;
  dueIn: string;
  amount: string;
  isPriority: boolean;
  dueDate: Date;
  bookingId?: string;
  hostelId?: string;
  userId: string;
}

export class PaymentService {
  /**
   * Get payment history for the current user
   * @param limit Maximum number of payments to return
   * @param status Optional filter for payment status
   * @returns Promise with array of payment items
   */
  static async getPaymentHistory(
    limit: number = 10,
    status?: 'successful' | 'pending' | 'failed'
  ): Promise<Payment[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const paymentsRef = collection(db, "payments");
      
      // Create query with filters
      let q = query(
        paymentsRef,
        where("userId", "==", currentUser.uid),
        orderBy("date", "desc"),
        limitQuery(limit)
      );
      
      // Add status filter if specified
      if (status) {
        q = query(q, where("status", "==", status));
      }
      
      const snapshot = await getDocs(q);
      
      const payments: Payment[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          hostelName: data.hostelName,
          hostelId: data.hostelId,
          bookingId: data.bookingId,
          amount: data.amount,
          status: data.status,
          date: data.date.toDate(),
          paymentMethod: data.paymentMethod,
          reference: data.reference,
          userId: data.userId
        });
      });
      
      return payments;
      
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  }
  
  /**
   * Get upcoming payments for the current user
   * @param limit Maximum number of upcoming payments to return
   * @returns Promise with array of upcoming payment items
   */
  static async getUpcomingPayments(limit: number = 5): Promise<UpcomingPayment[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const upcomingRef = collection(db, "upcomingPayments");
      
      // Get all upcoming payments for this user ordered by due date
      const q = query(
        upcomingRef,
        where("userId", "==", currentUser.uid),
        where("dueDate", ">=", Timestamp.now()),
        orderBy("dueDate", "asc"),
        limitQuery(limit)
      );
      
      const snapshot = await getDocs(q);
      
      const upcomingPayments: UpcomingPayment[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const dueDate = data.dueDate.toDate();
        
        // Calculate "dueIn" string from dueDate
        const dueInDays = Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        let dueIn: string;
        
        if (dueInDays === 0) dueIn = "today";
        else if (dueInDays === 1) dueIn = "tomorrow";
        else if (dueInDays < 7) dueIn = `${dueInDays} days`;
        else if (dueInDays < 14) dueIn = "1 week";
        else if (dueInDays < 30) dueIn = `${Math.floor(dueInDays / 7)} weeks`;
        else if (dueInDays < 60) dueIn = "1 month";
        else dueIn = `${Math.floor(dueInDays / 30)} months`;
        
        upcomingPayments.push({
          id: doc.id,
          title: data.title,
          dueIn: dueIn,
          amount: data.amount,
          isPriority: dueInDays <= 7, // Mark as priority if due within a week
          dueDate: dueDate,
          bookingId: data.bookingId,
          hostelId: data.hostelId,
          userId: data.userId
        });
      });
      
      return upcomingPayments;
      
    } catch (error) {
      console.error("Error fetching upcoming payments:", error);
      return [];
    }
  }
  
  /**
   * Process a payment
   * @param paymentId Payment ID to process
   * @param amount Amount to pay
   * @param method Payment method
   * @returns Promise with payment result
   */
  static async processPayment(
    paymentId: string,
    amount: string,
    method: string
  ): Promise<{ success: boolean; reference?: string; error?: string }> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const upcomingRef = doc(db, "upcomingPayments", paymentId);
      
      // Get the upcoming payment details
      const upcomingDoc = await getDocs(query(
        collection(db, "upcomingPayments"), 
        where("id", "==", paymentId),
        where("userId", "==", currentUser.uid)
      ));
      
      if (upcomingDoc.empty) {
        throw new Error("Payment not found or unauthorized");
      }
      
      const upcomingData = upcomingDoc.docs[0].data();
      
      // Create a new payment record
      const paymentsRef = collection(db, "payments");
      const reference = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      await addDoc(paymentsRef, {
        hostelName: upcomingData.title.split(' - ')[0],
        hostelId: upcomingData.hostelId,
        bookingId: upcomingData.bookingId,
        amount: amount,
        status: "successful",
        date: new Date(),
        paymentMethod: method,
        reference: reference,
        userId: currentUser.uid
      });
      
      // Delete the upcoming payment or mark it as paid
      await updateDoc(upcomingRef, {
        paid: true,
        paidDate: new Date(),
        paymentReference: reference
      });
      
      // Record activity
      await addDoc(collection(db, "activities"), {
        type: "payment",
        title: `You made a payment for ${upcomingData.title}`,
        description: `Payment of ${amount} via ${method}`,
        timestamp: new Date(),
        entityId: reference,
        entityType: "payment",
        userId: currentUser.uid
      });
      
      return {
        success: true,
        reference: reference
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown payment error"
      };
    }
  }
}