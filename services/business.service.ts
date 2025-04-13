import { auth, db } from "@/config/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as limitQuery, 
  getDocs, 
  doc, 
  getDoc,
  Timestamp,
  DocumentData
} from "firebase/firestore";
import { 
  BookingData, 
  RoomData, 
  ChartData, 
  AgentCommissionData,
  RoomOccupant,
  AgentBooking
} from "@/types/business";

export class BusinessService {
  /**
   * Get business dashboard statistics (revenue, bookings, etc.)
   * @returns Promise with dashboard statistics
   */
  static async getDashboardStats(businessId?: string): Promise<{
    totalRevenue: string;
    pendingPayments: string;
    projectedRevenue: string;
    totalBookings: number;
    pendingRequests: number;
    confirmedBookings: number;
    occupancyRate: number;
  }> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser && !businessId) {
        throw new Error("User not authenticated and no business ID provided");
      }
      
      // Use either passed businessId or current user's ID
      const uid = businessId || currentUser?.uid;
      
      // Get business stats from the Firestore
      const statsRef = doc(db, "businessStats", uid!);
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return {
          totalRevenue: formatCurrency(data.totalRevenue || 0),
          pendingPayments: formatCurrency(data.pendingPayments || 0),
          projectedRevenue: formatCurrency(data.projectedRevenue || 0),
          totalBookings: data.totalBookings || 0,
          pendingRequests: data.pendingRequests || 0,
          confirmedBookings: data.confirmedBookings || 0,
          occupancyRate: data.occupancyRate || 0
        };
      }
      
      // Return default values if no stats exist yet
      return {
        totalRevenue: "₦0",
        pendingPayments: "₦0",
        projectedRevenue: "₦0",
        totalBookings: 0,
        pendingRequests: 0,
        confirmedBookings: 0,
        occupancyRate: 0
      };
    } catch (error) {
      console.error("Error fetching business stats:", error);
      // Return default values in case of error
      return {
        totalRevenue: "₦0",
        pendingPayments: "₦0",
        projectedRevenue: "₦0",
        totalBookings: 0,
        pendingRequests: 0,
        confirmedBookings: 0,
        occupancyRate: 0
      };
    }
  }

  /**
   * Get room occupancy chart data
   * @returns Promise with chart data for occupancy visualization
   */
  static async getOccupancyChartData(businessId?: string): Promise<ChartData> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser && !businessId) {
        throw new Error("User not authenticated and no business ID provided");
      }
      
      // Use either passed businessId or current user's ID
      const uid = businessId || currentUser?.uid;
      
      // Get business occupancy stats from Firestore
      const statsRef = doc(db, "businessStats", uid!);
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        const data = statsDoc.data();
        const occupiedPercent = data.occupancyRate || 0;
        const vacantPercent = 100 - occupiedPercent;
        
        return {
          labels: ["Occupied", "Vacant"],
          datasets: [
            {
              label: "Occupancy",
              data: [occupiedPercent, vacantPercent],
              backgroundColor: ["#4F46E5", "#E5E7EB"],
              borderColor: ["#4F46E5", "#E5E7EB"],
              borderWidth: 1,
            },
          ],
        };
      }
      
      // Return default values if no stats exist yet
      return {
        labels: ["Occupied", "Vacant"],
        datasets: [
          {
            label: "Occupancy",
            data: [0, 100],
            backgroundColor: ["#4F46E5", "#E5E7EB"],
            borderColor: ["#4F46E5", "#E5E7EB"],
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching occupancy chart data:", error);
      // Return default chart data in case of error
      return {
        labels: ["Occupied", "Vacant"],
        datasets: [
          {
            label: "Occupancy",
            data: [0, 100],
            backgroundColor: ["#4F46E5", "#E5E7EB"],
            borderColor: ["#4F46E5", "#E5E7EB"],
            borderWidth: 1,
          },
        ],
      };
    }
  }

  /**
   * Get recent bookings 
   * @param limit Maximum number of bookings to return
   * @returns Promise with recent bookings
   */
  static async getRecentBookings(limit: number = 3, businessId?: string): Promise<BookingData[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser && !businessId) {
        throw new Error("User not authenticated and no business ID provided");
      }
      
      // Use either passed businessId or current user's ID
      const uid = businessId || currentUser?.uid;
      
      // Query recent bookings from Firestore
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("businessId", "==", uid),
        orderBy("createdAt", "desc"),
        limitQuery(limit)
      );
      
      const bookingsSnapshot = await getDocs(q);
      
      if (bookingsSnapshot.empty) {
        return [];
      }
      
      const bookings: BookingData[] = [];
      
      bookingsSnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          studentName: data.studentName || "Unknown Student",
          hostelName: data.hostelName || "Unknown Hostel",
          date: formatDate(data.createdAt?.toDate() || new Date()),
          amount: data.amount || 0,
          status: data.status || "pending"
        });
      });
      
      return bookings;
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      return [];
    }
  }

  /**
   * Get room occupancy data for a hostel
   * @param hostelId ID of the hostel to get room data for
   * @param limit Maximum number of rooms to return
   * @returns Promise with room occupancy data
   */
  static async getRoomOccupancy(hostelId: string, limit: number = 10): Promise<RoomData[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Query rooms from Firestore
      const roomsRef = collection(db, "rooms");
      const q = query(
        roomsRef,
        where("hostelId", "==", hostelId),
        limitQuery(limit)
      );
      
      const roomsSnapshot = await getDocs(q);
      
      if (roomsSnapshot.empty) {
        return [];
      }
      
      const rooms: RoomData[] = [];
      
      for (const roomDoc of roomsSnapshot.docs) {
        const roomData = roomDoc.data();
        
        // Get occupants for this room
        const occupantsRef = collection(db, "occupants");
        const occupantsQuery = query(
          occupantsRef,
          where("roomId", "==", roomDoc.id)
        );
        
        const occupantsSnapshot = await getDocs(occupantsQuery);
        const occupants: RoomOccupant[] = [];
        
        occupantsSnapshot.forEach((occupantDoc) => {
          const occupantData = occupantDoc.data();
          occupants.push({
            id: occupantDoc.id,
            name: occupantData.name || "Unknown",
            leaseEnd: formatDate(occupantData.leaseEnd?.toDate() || new Date()),
            paymentStatus: occupantData.paymentStatus || "pending",
            agentAssisted: occupantData.agentAssisted || false,
            agentName: occupantData.agentName
          });
        });
        
        rooms.push({
          roomId: roomDoc.id,
          roomNumber: roomData.roomNumber || "Unknown",
          roomType: roomData.roomType || "Standard",
          capacity: roomData.capacity || 1,
          occupiedCount: occupants.length,
          occupants: occupants
        });
      }
      
      return rooms;
    } catch (error) {
      console.error("Error fetching room occupancy:", error);
      return [];
    }
  }

  /**
   * Get list of hostels for a business
   * @returns Promise with list of hostels
   */
  static async getBusinessHostels(): Promise<{ id: string, name: string }[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Query hostels from Firestore
      const hostelsRef = collection(db, "hostels");
      const q = query(
        hostelsRef,
        where("businessId", "==", currentUser.uid)
      );
      
      const hostelsSnapshot = await getDocs(q);
      
      if (hostelsSnapshot.empty) {
        return [];
      }
      
      const hostels: { id: string, name: string }[] = [];
      
      hostelsSnapshot.forEach((doc) => {
        const data = doc.data();
        hostels.push({
          id: doc.id,
          name: data.name || "Unnamed Hostel"
        });
      });
      
      return hostels;
    } catch (error) {
      console.error("Error fetching business hostels:", error);
      return [];
    }
  }

  /**
   * Get agent commission data
   * @param limit Maximum number of agents to return
   * @returns Promise with agent commission data
   */
  static async getAgentCommissions(limit: number = 5): Promise<AgentCommissionData[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Query agents from Firestore
      const agentsRef = collection(db, "agents");
      const q = query(
        agentsRef,
        where("businessIds", "array-contains", currentUser.uid),
        limitQuery(limit)
      );
      
      const agentsSnapshot = await getDocs(q);
      
      if (agentsSnapshot.empty) {
        return [];
      }
      
      const agents: AgentCommissionData[] = [];
      
      for (const agentDoc of agentsSnapshot.docs) {
        const agentData = agentDoc.data();
        
        // Get bookings for this agent
        const bookingsRef = collection(db, "bookings");
        const bookingsQuery = query(
          bookingsRef,
          where("agentId", "==", agentDoc.id),
          where("businessId", "==", currentUser.uid)
        );
        
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookings: AgentBooking[] = [];
        let totalCommission = 0;
        let pendingCommission = 0;
        let paidCommission = 0;
        let lastBookingDate = "";
        
        bookingsSnapshot.forEach((bookingDoc) => {
          const bookingData = bookingDoc.data();
          const commissionAmount = bookingData.commissionAmount || 0;
          const commissionStatus = bookingData.commissionStatus || "pending";
          
          // Update commission totals
          totalCommission += commissionAmount;
          if (commissionStatus === "pending") {
            pendingCommission += commissionAmount;
          } else {
            paidCommission += commissionAmount;
          }
          
          // Track last booking date
          const bookingDate = formatDate(bookingData.createdAt?.toDate() || new Date());
          if (!lastBookingDate || bookingDate > lastBookingDate) {
            lastBookingDate = bookingDate;
          }
          
          bookings.push({
            id: bookingDoc.id,
            hostelName: bookingData.hostelName || "Unknown Hostel",
            roomNumber: bookingData.roomNumber || "Unknown",
            studentName: bookingData.studentName || "Unknown Student",
            bookingDate: bookingDate,
            amount: bookingData.amount || 0,
            commissionAmount: commissionAmount,
            commissionStatus: commissionStatus
          });
        });
        
        agents.push({
          agentId: agentDoc.id,
          agentName: agentData.displayName || "Unknown Agent",
          profileImage: agentData.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
          totalCommission: totalCommission,
          pendingCommission: pendingCommission,
          paidCommission: paidCommission,
          bookingsCount: bookings.length,
          lastBookingDate: lastBookingDate || "N/A",
          bookings: bookings
        });
      }
      
      return agents;
    } catch (error) {
      console.error("Error fetching agent commissions:", error);
      return [];
    }
  }
}

// Helper functions
function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}