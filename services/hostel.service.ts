import { UserProfile } from "@/types/user";

export interface HostelItem {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  isFeatured?: boolean;
  imageUrl?: string;
  university?: string;
  amenities?: string[];
  availableRooms?: number;
}

export class HostelService {
  /**
   * Get recommended hostels based on user profile and preferences
   * @param userId User ID to get recommendations for
   * @param userProfile User profile containing preferences
   * @param limit Maximum number of hostels to return
   * @returns Promise with array of recommended hostel items
   */
  static async getRecommendedHostels(
    userId: string,
    userProfile: UserProfile | null,
    limit: number = 3
  ): Promise<HostelItem[]> {
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, using mock data with university-based filtering if available
      const hostels = this.getMockHostels();
      
      // Apply filtering based on user preferences if available
      let filtered = hostels;
      
      if (userProfile?.university) {
        // Filter hostels near the user's university if specified
        filtered = hostels.filter(hostel => 
          hostel.university?.toLowerCase() === userProfile.university?.toLowerCase() ||
          hostel.location.toLowerCase().includes(userProfile.university!.toLowerCase())
        );
      }
      
      // If we don't have enough matches after filtering, add some general recommendations
      if (filtered.length < limit) {
        const additional = hostels
          .filter(h => !filtered.some(f => f.id === h.id))
          .slice(0, limit - filtered.length);
        
        filtered = [...filtered, ...additional];
      }
      
      // Sort by rating (high to low) and limit results
      return filtered
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching recommended hostels:", error);
      return [];
    }
  }
  
  /**
   * Get popular hostels (highest rated or most booked)
   * @param limit Maximum number of hostels to return
   * @returns Promise with array of popular hostels
   */
  static async getPopularHostels(limit: number = 3): Promise<HostelItem[]> {
    try {
      // In a real implementation, this would fetch from Firebase
      // Sorting by rating for now as an indicator of popularity
      const hostels = this.getMockHostels();
      
      return hostels
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching popular hostels:", error);
      return [];
    }
  }
  
  /**
   * Generate mock hostel data for development
   * @returns Array of mock hostel items
   */
  private static getMockHostels(): HostelItem[] {
    return [
      {
        id: "1",
        name: "Unilag Female Hostel",
        location: "Akoka, Lagos",
        price: "₦180,000/year",
        rating: 4.7,
        university: "unilag",
        imageUrl: "/assets/mock/hostel1.jpg",
        isFeatured: true,
        amenities: ["Wi-Fi", "Security", "Water Supply"],
        availableRooms: 12
      },
      {
        id: "2",
        name: "LASU Exclusive Male Hostel",
        location: "Ojo, Lagos",
        price: "₦150,000/year",
        rating: 4.2,
        university: "lasu",
        imageUrl: "/assets/mock/hostel2.jpg",
        amenities: ["Wi-Fi", "Gym", "Study Room"],
        availableRooms: 5
      },
      {
        id: "3",
        name: "UniAbuja Deluxe Hostel",
        location: "Abuja, FCT",
        price: "₦200,000/year",
        rating: 4.8,
        university: "uniabuja",
        imageUrl: "/assets/mock/hostel3.jpg",
        isFeatured: true,
        amenities: ["Wi-Fi", "Restaurant", "Laundry"],
        availableRooms: 8
      },
      {
        id: "4",
        name: "OAU Campus Lodge",
        location: "Ile-Ife, Osun",
        price: "₦130,000/year",
        rating: 4.0,
        university: "oau",
        imageUrl: "/assets/mock/hostel4.jpg",
        amenities: ["Security", "Water Supply"],
        availableRooms: 3
      },
      {
        id: "5",
        name: "UI Premium Hostel",
        location: "Ibadan, Oyo",
        price: "₦160,000/year",
        rating: 4.5,
        university: "ui",
        imageUrl: "/assets/mock/hostel5.jpg",
        amenities: ["Wi-Fi", "Cafeteria", "Study Room"],
        availableRooms: 15
      }
    ];
  }
}