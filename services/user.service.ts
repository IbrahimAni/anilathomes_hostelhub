import { auth, db } from "@/config/firebase";
import { UserProfile, UserRole } from "@/types/user";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  DocumentReference
} from "firebase/firestore";

export class UserService {
  /**
   * Creates a new user document in Firestore
   */
  static async createUser(userId: string, email: string | null): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      
      const userData: Partial<UserProfile> = {
        uid: userId,
        email: email,
        displayName: null,
        role: null,
        photoURL: null,
        phoneNumber: null,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  }

  /**
   * Gets user document from Firestore
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user document:", error);
      throw error;
    }
  }

  /**
   * Updates user role in Firestore
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      
      // Check if user exists first
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist yet
        await this.createUser(userId, auth.currentUser?.email || null);
      }
      
      // Update the role
      await updateDoc(userRef, {
        role: role,
        displayName: role, // For consistency with auth profile
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  /**
   * Updates user profile in Firestore
   */
  static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...data,
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}