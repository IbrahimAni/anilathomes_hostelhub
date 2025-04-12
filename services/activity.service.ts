import { auth } from "@/config/firebase";
import { collection, query, where, orderBy, limit as limitQuery, getDocs, addDoc, getFirestore } from "firebase/firestore";

export interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'favorite' | 'profile_update' | 'other';
  title: string;
  description: string;
  timestamp: Date;
  entityId?: string; // ID of related entity (hostel, booking, etc.)
  entityType?: string; // Type of related entity
  userId: string;
}

export class ActivityService {
  /**
   * Get recent user activities
   * @param limit Maximum number of activities to return
   * @param type Optional filter for activity type
   * @returns Promise with array of activities
   */
  static async getRecentActivities(
    limit: number = 5,
    type?: Activity['type']
  ): Promise<Activity[]> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const activitiesRef = collection(db, "activities");
      
      // Create query with filters
      let q = query(
        activitiesRef,
        where("userId", "==", currentUser.uid),
        orderBy("timestamp", "desc"),
        limitQuery(limit)
      );
      
      // Add type filter if specified
      if (type) {
        q = query(q, where("type", "==", type));
      }
      
      const snapshot = await getDocs(q);
      
      const activities: Activity[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: data.type,
          title: data.title,
          description: data.description,
          timestamp: data.timestamp.toDate(),
          entityId: data.entityId,
          entityType: data.entityType,
          userId: data.userId
        });
      });
      
      return activities;
      
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  }
  
  /**
   * Record a new user activity
   * @param activity Activity to record
   * @returns Promise indicating success
   */
  static async recordActivity(
    activity: Omit<Activity, 'id' | 'timestamp' | 'userId'>
  ): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const activitiesRef = collection(db, "activities");
      
      await addDoc(activitiesRef, {
        ...activity,
        timestamp: new Date(),
        userId: currentUser.uid
      });
      
      return true;
    } catch (error) {
      console.error("Error recording activity:", error);
      return false;
    }
  }
  
  /**
   * Get statistics about user activity
   * @returns Promise with activity counts by type
   */
  static async getActivityStats(): Promise<Record<Activity['type'], number>> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const db = getFirestore();
      const activitiesRef = collection(db, "activities");
      
      // Query all activities for this user
      const q = query(
        activitiesRef,
        where("userId", "==", currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      
      // Count activities by type
      const stats: Record<Activity['type'], number> = {
        booking: 0,
        payment: 0,
        favorite: 0,
        profile_update: 0,
        other: 0
      };
      
      snapshot.forEach(doc => {
        const type = doc.data().type as Activity['type'];
        stats[type]++;
      });
      
      return stats;
      
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      return {
        booking: 0,
        payment: 0,
        favorite: 0,
        profile_update: 0,
        other: 0
      };
    }
  }
}