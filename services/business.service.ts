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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  BookingData,
  RoomData,
  ChartData,
  AgentCommissionData,
  RoomOccupant,
  AgentBooking,
} from "@/types/business";
// Firebase Storage imports
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
          occupancyRate: data.occupancyRate || 0,
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
        occupancyRate: 0,
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
        occupancyRate: 0,
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
  static async getRecentBookings(
    limit: number = 3,
    businessId?: string
  ): Promise<BookingData[]> {
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
          status: data.status || "pending",
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
  static async getRoomOccupancy(
    hostelId: string,
    limit: number = 10
  ): Promise<RoomData[]> {
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
            agentName: occupantData.agentName,
          });
        });

        rooms.push({
          roomId: roomDoc.id,
          roomNumber: roomData.roomNumber || "Unknown",
          roomType: roomData.roomType || "Standard",
          capacity: roomData.capacity || 1,
          occupiedCount: occupants.length,
          occupants: occupants,
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
  static async getBusinessHostels(): Promise<
    {
      id: string;
      name: string;
      location?: string;
      imageUrl?: string;
      availableRooms?: number;
    }[]
  > {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Query hostels from Firestore
      const hostelsRef = collection(db, "hostels");
      const q = query(hostelsRef, where("businessId", "==", currentUser.uid));

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
          imageUrl:
            data.imageUrls && data.imageUrls.length > 0
              ? data.imageUrls[0]
              : undefined,
          availableRooms: data.availableRooms || 0,
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
   * @param hostelId Optional ID of the hostel to filter agent commissions
   * @param limit Maximum number of agents to return
   * @returns Promise with agent commission data
   */
  static async getAgentCommissions(
    hostelId?: string,
    limit: number = 5
  ): Promise<AgentCommissionData[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      // Query agents belonging to this business
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
        // Get bookings for this agent, optionally filtered by hostel
        const bookingsRef = collection(db, "bookings");
        const bookingsQuery = hostelId
          ? query(
              bookingsRef,
              where("agentId", "==", agentDoc.id),
              where("businessId", "==", currentUser.uid),
              where("hostelId", "==", hostelId)
            )
          : query(
              bookingsRef,
              where("agentId", "==", agentDoc.id),
              where("businessId", "==", currentUser.uid)
            );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        // skip agents without bookings for this hostel when filtering
        if (hostelId && bookingsSnapshot.empty) {
          continue;
        }
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
          const bookingDate = formatDate(
            bookingData.createdAt?.toDate() || new Date()
          );
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
            commissionStatus: commissionStatus,
          });
        });
        agents.push({
          agentId: agentDoc.id,
          agentName: agentData.displayName || "Unknown Agent",
          profileImage:
            agentData.photoURL ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
          verified: agentData.verified || false,
          active: agentData.active !== undefined ? agentData.active : true,
          totalCommission: totalCommission,
          pendingCommission: pendingCommission,
          paidCommission: paidCommission,
          bookingsCount: bookings.length,
          lastBookingDate: lastBookingDate || "N/A",
          bookings: bookings,
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
            const uniqueFilename = `${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 15)}_${imageFile.name}`;
            const imageStorageRef = storageRef(
              storage,
              `hostels/${currentUser.uid}/${uniqueFilename}`
            );

            // Set proper metadata for CORS handling
            const metadata = {
              contentType: imageFile.type,
              customMetadata: {
                origin: window.location.origin,
                "uploaded-by": currentUser.uid,
              },
            };

            // Upload the file with metadata
            const snapshot = await uploadBytes(
              imageStorageRef,
              imageFile,
              metadata
            );

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
        reviewCount: 0,
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
                if (urlObj.pathname.includes("/o/")) {
                  const imagePath = decodeURIComponent(
                    urlObj.pathname.split("/o/")[1]?.split("?")[0]
                  );

                  if (imagePath) {
                    const imageRef = storageRef(storage, imagePath);
                    await deleteObject(imageRef);
                    console.log("Image deleted successfully:", imagePath);
                  }
                } else {
                  console.log(
                    "Not a Firebase Storage URL or different format:",
                    imageUrl
                  );
                }
              } catch (urlError) {
                // If URL parsing fails, try a different approach using string manipulation
                console.log(
                  "URL parsing failed, trying alternative approach for:",
                  imageUrl
                );

                // Extract filename directly if it's a simple path
                if (imageUrl.includes("/hostels/")) {
                  const pathParts = imageUrl.split("/hostels/");
                  if (pathParts.length > 1) {
                    const relativePath = `hostels/${
                      pathParts[1].split("?")[0]
                    }`;
                    const imageRef = storageRef(storage, relativePath);
                    await deleteObject(imageRef);
                    console.log(
                      "Image deleted with alternative method:",
                      relativePath
                    );
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
          userId: currentUser.uid,
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
        ...data,
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
   */ static async updateHostel(hostelData: any) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const { id, newImages, existingImages, ...updatedData } = hostelData;

      // Validate ID before creating a document reference
      if (!id || typeof id !== "string") {
        throw new Error(
          "Invalid hostel ID. Expected a string but got: " + typeof id
        );
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
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}_${image.name}`;
          // Use userId instead of hostelId to match storage rules
          const imageRef = storageRef(
            storage,
            `hostels/${currentUser.uid}/${fileName}`
          );

          // Upload the image with metadata
          const metadata = {
            contentType: image.type,
            customMetadata: {
              hostelId: id,
              "uploaded-by": currentUser.uid,
            },
          };

          // Upload the image
          await uploadBytes(imageRef, image, metadata);

          // Get the download URL
          const downloadURL = await getDownloadURL(imageRef);
          imageUrls.push(downloadURL);
        }
      } // Update the hostel document with new data including all image URLs
      await updateDoc(hostelRef, {
        ...updatedData,
        imageUrls: imageUrls, // Store all image URLs in imageUrls array
        imageUrl: imageUrls[0] || null, // Use the first image as the primary image
        images: imageUrls, // Also store in images for backward compatibility
        location:
          typeof updatedData.location === "object"
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

  /**
   * Add a new agent associated with the current business
   * @param agent Agent details to add
   * @returns ID of the newly created agent document
   */ static async addAgent(agent: {
    displayName: string;
    email: string;
    phone?: string;
    profileImage?: string;
  }): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const randomAvatarNumber = Math.floor(Math.random() * 9) + 1;
    const newAgent = {
      displayName: agent.displayName,
      email: agent.email,
      phone: agent.phone || "",
      photoURL:
        agent.profileImage ||
        `https://randomuser.me/api/portraits/lego/${randomAvatarNumber}.jpg`,
      businessIds: [currentUser.uid],
      verified: false,
      active: true,
      createdAt: Timestamp.now(),
    };
    const agentRef = await addDoc(collection(db, "agents"), newAgent);
    return agentRef.id;
  }

  /**
   * Toggle the active status of an agent
   * @param agentId ID of the agent to update
   * @param active Whether the agent should be active or not
   * @returns Promise indicating success
   */
  static async toggleAgentActiveStatus(
    agentId: string,
    active: boolean
  ): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Check if the agent belongs to the current business
    const agentRef = doc(db, "agents", agentId);
    const agentDoc = await getDoc(agentRef);

    if (!agentDoc.exists()) {
      throw new Error("Agent not found");
    }

    const agentData = agentDoc.data();
    if (!agentData.businessIds?.includes(currentUser.uid)) {
      throw new Error(
        "Unauthorized - This agent is not associated with your business"
      );
    }

    // Update the agent's active status
    await updateDoc(agentRef, {
      active: active,
      updatedAt: Timestamp.now(),
    });

    return true;
  }

  /**
   * Get list of active, verified agents for this business
   */
  static async getBusinessAgents(limit: number = 50) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");
    const agentsRef = collection(db, "agents");
    const q = query(
      agentsRef,
      where("businessIds", "array-contains", currentUser.uid),
      limitQuery(limit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      agentId: doc.id,
      agentName: (doc.data() as any).displayName,
      profileImage: (doc.data() as any).photoURL || '',
      verified: (doc.data() as any).verified || false,
      active: (doc.data() as any).active !== false
    }));
  }

  /**
   * Get assigned agents for a specific hostel
   */
  static async getAssignedAgents(hostelId: string) {
    const hostelRef = doc(db, "hostels", hostelId);
    const hostelSnap = await getDoc(hostelRef);
    if (!hostelSnap.exists()) return [];
    const data = hostelSnap.data() as DocumentData;
    const ids: string[] = data.agentIds || [];
    const agents = [];
    for (const agentId of ids) {
      const agentDoc = await getDoc(doc(db, "agents", agentId));
      if (agentDoc.exists()) {
        const ad = agentDoc.data() as any;
        agents.push({
          agentId: agentDoc.id,
          agentName: ad.displayName,
          profileImage: ad.photoURL || "",
          verified: ad.verified,
          active: ad.active,
        });
      }
    }
    return agents;
  }

  /**
   * Assign an agent to a hostel
   */
  static async assignAgentToHostel(hostelId: string, agentId: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");
    const hostelRef = doc(db, "hostels", hostelId);
    await updateDoc(hostelRef, { agentIds: arrayUnion(agentId) });
    return true;
  }

  /**
   * Remove an agent from a hostel
   */
  static async removeAgentFromHostel(hostelId: string, agentId: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');
    
    const hostelRef = doc(db, 'hostels', hostelId);
    const hostelDoc = await getDoc(hostelRef);
    
    if (!hostelDoc.exists()) {
      throw new Error('Hostel not found');
    }
    
    const data = hostelDoc.data();
    const agentIds = data.agentIds || [];
    
    // Remove the agent ID from the array
    const updatedAgentIds = agentIds.filter((id: string) => id !== agentId);
    
    // Update the document
    await updateDoc(hostelRef, { agentIds: updatedAgentIds });
    return true;
  }

  /**
   * Get a specific agent by ID with complete details including commissions
   */
  static async getAgentById(agentId: string): Promise<AgentCommissionData | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");
      
      // First get the basic agent info
      const agentRef = doc(db, "agents", agentId);
      const agentDoc = await getDoc(agentRef);
      
      if (!agentDoc.exists()) return null;
      
      const agentData = agentDoc.data();
      
      // Check if this agent belongs to the current business
      if (!agentData.businessIds?.includes(currentUser.uid)) {
        return null; // Agent doesn't belong to this business
      }
      
      // Get commission data for this agent
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("agentId", "==", agentId),
        where("businessId", "==", currentUser.uid)
      );
      const bookingsSnapshot = await getDocs(q);
      
      // Process booking data for this agent
      const bookings: AgentBooking[] = bookingsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          studentName: data.studentName || 'Unknown',
          hostelName: data.hostelName || 'Unknown',
          roomNumber: data.roomNumber || 'N/A',
          bookingDate: data.bookingDate ? new Date(data.bookingDate.toDate()).toISOString().split('T')[0] : 'N/A',
          amount: data.amount || 0,
          commissionAmount: data.commissionAmount || 0,
          commissionStatus: data.commissionPaid ? 'paid' : 'pending'
        };
      });
      
      // Calculate commission totals
      const totalCommission = bookings.reduce((sum, booking) => sum + booking.commissionAmount, 0);
      const paidCommission = bookings
        .filter(booking => booking.commissionStatus === 'paid')
        .reduce((sum, booking) => sum + booking.commissionAmount, 0);
      const pendingCommission = totalCommission - paidCommission;
      
      // Find the last booking date
      let lastBookingDate = 'N/A';
      if (bookings.length > 0) {
        const sortedBookings = [...bookings].sort((a, b) => 
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );
        lastBookingDate = sortedBookings[0].bookingDate;
      }
      
      // Return the complete agent data with commissions
      return {
        agentId,
        agentName: agentData.displayName || 'Unknown',
        profileImage: agentData.photoURL || '',
        verified: agentData.verified || false,
        active: agentData.active !== false,
        totalCommission,
        pendingCommission,
        paidCommission,
        bookingsCount: bookings.length,
        lastBookingDate,
        bookings
      };
    } catch (error) {
      console.error("Error fetching agent details:", error);
      return null;
    }
  }

  /**
   * Get all hostels that an agent is assigned to
   * @param agentId The ID of the agent
   * @returns Promise with list of hostels the agent is assigned to
   */
  static async getHostelsForAgent(agentId: string): Promise<{ id: string; name: string; location?: string }[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");
      
      // First verify this agent belongs to the business
      const agentRef = doc(db, "agents", agentId);
      const agentDoc = await getDoc(agentRef);
      
      if (!agentDoc.exists() || !agentDoc.data().businessIds?.includes(currentUser.uid)) {
        return []; // Agent not found or doesn't belong to this business
      }
      
      // Query all hostels owned by this business
      const hostelsRef = collection(db, "hostels");
      const q = query(hostelsRef, where("businessId", "==", currentUser.uid));
      const hostelsSnapshot = await getDocs(q);
      
      const assignedHostels = [];
      
      // Check each hostel to see if this agent is assigned to it
      for (const hostelDoc of hostelsSnapshot.docs) {
        const hostelData = hostelDoc.data();
        const agentIds = hostelData.agentIds || [];
        
        // If this agent is in the hostel's agentIds array, add it to the results
        if (agentIds.includes(agentId)) {
          assignedHostels.push({
            id: hostelDoc.id,
            name: hostelData.name || "Unnamed Hostel",
            location: hostelData.location || "",
          });
        }
      }
      
      return assignedHostels;
    } catch (error) {
      console.error("Error fetching hostels for agent:", error);
      return [];
    }
  }
}

// Helper functions
function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
