import { auth, googleProvider } from "@/config/firebase";
import { AuthError, LoginFormData, SignUpFormData } from "@/types/auth";
import { UserService } from "./user.service";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential
} from "firebase/auth";

export class AuthService {
  static async loginWithEmailAndPassword(data: LoginFormData): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async loginWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user in Firestore
      if (result.user) {
        await this.saveUserToFirestore(result);
      }

      return result;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async signUpWithEmailAndPassword(data: SignUpFormData): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Save the new user to Firestore
      if (result.user) {
        await this.saveUserToFirestore(result);
      }

      return result;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  private static async saveUserToFirestore(credential: UserCredential): Promise<void> {
    const { user } = credential;
    
    try {
      // Create or update user in Firestore
      await UserService.createUser(user.uid, user.email);
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Don't throw here to prevent blocking the auth flow
      // The user is already authenticated with Firebase Auth
    }
  }

  private static handleAuthError(error: unknown): AuthError {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "An unexpected error occurred" };
  }
}