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
  DocumentData,
  addDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { 
  BookingData, 
  RoomData, 
  ChartData, 
  AgentCommissionData,
  RoomOccupant,
  AgentBooking
} from "@/types/business";
// Firebase Storage imports
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
   * @returns Promise with list of hostels with details
   */
  static async getBusinessHostels(): Promise<{ 
    id: string; 
    name: string;
    location?: string;
    imageUrl?: string;
    availableRooms?: number;
  }[]> {
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
      
      const hostels: { 
        id: string; 
        name: string; 
        location?: string;
        imageUrl?: string;
        availableRooms?: number;
      }[] = [];
      
      hostelsSnapshot.forEach((doc) => {
        const data = doc.data();
        hostels.push({
          id: doc.id,
          name: data.name || "Unnamed Hostel",
          location: data.location || "",
          // Use the first image URL if available, otherwise undefined
          imageUrl: data.imageUrls && data.imageUrls.length > 0 ? data.imageUrls[0] : undefined,
          availableRooms: data.availableRooms || 0
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
  /**
   * Add a new hostel for the business
   * @param hostelData Data for the new hostel to be added
   * @returns Promise with the newly created hostel ID
   */
  static async addHostel(hostelData: any): Promise<string> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Upload images to Firebase Storage
      const imageUrls = [];
      
      if (hostelData.images && hostelData.images.length > 0) {
        const storage = getStorage();
        
        for (const imageFile of hostelData.images) {
          try {
            // Create a storage reference with more unique path to avoid collisions
            const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${imageFile.name}`;
            const imageStorageRef = storageRef(storage, `hostels/${currentUser.uid}/${uniqueFilename}`);
            
            // Set proper metadata for CORS handling
            const metadata = {
              contentType: imageFile.type,
              customMetadata: {
                'origin': window.location.origin,
                'uploaded-by': currentUser.uid
              }
            };
            
            // Upload the file with metadata
            const snapshot = await uploadBytes(imageStorageRef, imageFile, metadata);
            
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            imageUrls.push(downloadURL);
            
            console.log("Image uploaded successfully:", downloadURL);
          } catch (error) {
            console.error("Error uploading image:", error);
            // Continue with other images even if one fails
          }
        }
      }
      
      // Create a clean data object for Firestore (without the File objects)
      const hostelWithBusinessId = {
        name: hostelData.name,
        description: hostelData.description,
        location: `${hostelData.location.address}, ${hostelData.location.city}, ${hostelData.location.state}`,
        locationDetails: hostelData.location, // Store detailed location data
        imageUrls: [...imageUrls, ...(hostelData.imageUrls || [])], // Combine uploaded URLs with any existing URLs
        pricePerYear: hostelData.pricePerYear,
        price: `₦${Number(hostelData.pricePerYear).toLocaleString()}/year`,
        roomTypes: hostelData.roomTypes,
        availableRooms: hostelData.availableRooms,
        amenities: hostelData.amenities,
        contact: hostelData.contact,
        rules: hostelData.rules,
        geolocation: hostelData.geolocation,
        businessId: currentUser.uid,
        createdAt: new Date(),
        rating: 0,
        reviewCount: 0
      };
      
      // Add the hostel to Firestore
      const hostelRef = collection(db, "hostels");
      const docRef = await addDoc(hostelRef, hostelWithBusinessId);
      
      console.log("Hostel added successfully with ID:", docRef.id);
      
      // Return the ID of the newly created hostel
      return docRef.id;
    } catch (error) {
      console.error("Error adding hostel:", error);
      throw error;
    }
  }
  
  /**
   * Delete a hostel for the business
   * @param hostelId ID of the hostel to delete
   * @returns Promise indicating success or failure
   */
  static async deleteHostel(hostelId: string): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Get the hostel document to verify ownership
      const hostelDocRef = doc(db, "hostels", hostelId);
      const hostelSnapshot = await getDoc(hostelDocRef);
      
      if (!hostelSnapshot.exists()) {
        throw new Error("Hostel not found");
      }
      
      const hostelData = hostelSnapshot.data();
      
      // Verify that the current user is the owner of this hostel
      if (hostelData.businessId !== currentUser.uid) {
        throw new Error("Unauthorized - You do not own this hostel");
      }
      
      // Delete the hostel document from Firestore
      await deleteDoc(hostelDocRef);
        // If there were images, delete them from storage too
      if (hostelData.imageUrls && hostelData.imageUrls.length > 0) {
        try {
          const storage = getStorage();
          
          for (const imageUrl of hostelData.imageUrls) {
            try {
              // Skip if imageUrl is undefined or empty
              if (!imageUrl) {
                console.log("Skipping empty image URL");
                continue;
              }
              
              // Extract the file path from the URL safely
              try {
                const urlObj = new URL(imageUrl);
                
                // Check if this is a Firebase Storage URL with the expected format
                if (urlObj.pathname.includes('/o/')) {
                  const imagePath = decodeURIComponent(urlObj.pathname.split('/o/')[1]?.split('?')[0]);
                  
                  if (imagePath) {
                    const imageRef = storageRef(storage, imagePath);
                    await deleteObject(imageRef);
                    console.log("Image deleted successfully:", imagePath);
                  }
                } else {
                  console.log("Not a Firebase Storage URL or different format:", imageUrl);
                }
              } catch (urlError) {
                // If URL parsing fails, try a different approach using string manipulation
                console.log("URL parsing failed, trying alternative approach for:", imageUrl);
                
                // Extract filename directly if it's a simple path
                if (imageUrl.includes('/hostels/')) {
                  const pathParts = imageUrl.split('/hostels/');
                  if (pathParts.length > 1) {
                    const relativePath = `hostels/${pathParts[1].split('?')[0]}`;
                    const imageRef = storageRef(storage, relativePath);
                    await deleteObject(imageRef);
                    console.log("Image deleted with alternative method:", relativePath);
                  }
                }
              }
            } catch (imgError) {
              console.error("Error deleting image:", imgError);
              // Continue with other deletions even if one fails
            }
          }
        } catch (storageError) {
          console.error("Error accessing storage for cleanup:", storageError);
          // Don't let storage cleanup failure affect the overall operation
        }
      }
      
      // Record the delete action in activity logs
      try {
        const activitiesRef = collection(db, "activities");
        await addDoc(activitiesRef, {
          type: "delete_hostel",
          title: `Deleted hostel: ${hostelData.name}`,
          description: `Hostel was permanently removed from your properties`,
          timestamp: new Date(),
          entityId: hostelId,
          entityType: "hostel",
          userId: currentUser.uid
        });
      } catch (activityError) {
        console.error("Error recording activity:", activityError);
        // Don't let activity logging failure affect the overall operation
      }
      
      console.log("Hostel deleted successfully with ID:", hostelId);
      return true;
    } catch (error) {
      console.error("Error deleting hostel:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific hostel
   * @param hostelId The ID of the hostel to fetch details for
   * @returns Promise with detailed hostel data
   */
  static async getHostelDetails(hostelId: string) {
    try {
      const hostelRef = doc(db, "hostels", hostelId);
      const hostelDoc = await getDoc(hostelRef);
      
      if (!hostelDoc.exists()) {
        throw new Error("Hostel not found");
      }
      
      const data = hostelDoc.data();
      return {
        id: hostelDoc.id,
        ...data
      };
    } catch (error) {
      console.error("Error fetching hostel details:", error);
      throw error;
    }
  }

  /**
   * Update an existing hostel with new information
   * @param hostelData The updated hostel data including the hostel ID
   * @returns Promise that resolves when the update is complete
   */  static async updateHostel(hostelData: any) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const { id, newImages, existingImages, ...updatedData } = hostelData;
      
      // Validate ID before creating a document reference
      if (!id || typeof id !== 'string') {
        throw new Error("Invalid hostel ID. Expected a string but got: " + typeof id);
      }
      
      // Reference to the hostel document
      const hostelRef = doc(db, "hostels", id);
      
      // Upload any new images
      const storage = getStorage();
      const imageUrls = [...existingImages];
        // Upload new images if any
      if (newImages && newImages.length > 0) {
        for (const image of newImages) {
          // Create a unique file name
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}_${image.name}`;
          // Use userId instead of hostelId to match storage rules
          const imageRef = storageRef(storage, `hostels/${currentUser.uid}/${fileName}`);
          
          // Upload the image with metadata
          const metadata = {
            contentType: image.type,
            customMetadata: {
              'hostelId': id,
              'uploaded-by': currentUser.uid
            }
          };
          
          // Upload the image
          await uploadBytes(imageRef, image, metadata);
          
          // Get the download URL
          const downloadURL = await getDownloadURL(imageRef);
          imageUrls.push(downloadURL);
        }
      }      // Update the hostel document with new data including all image URLs
      await updateDoc(hostelRef, {
        ...updatedData,
        imageUrls: imageUrls,     // Store all image URLs in imageUrls array
        imageUrl: imageUrls[0] || null, // Use the first image as the primary image
        images: imageUrls,        // Also store in images for backward compatibility
        location: typeof updatedData.location === 'object' 
          ? `${updatedData.location.address}, ${updatedData.location.city}, ${updatedData.location.state}` 
          : updatedData.location,
        locationDetails: updatedData.location, // Store detailed location data
        updatedAt: Timestamp.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating hostel:", error);
      throw error;
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