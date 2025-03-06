import { auth, googleProvider } from "@/config/firebase";
import { AuthError, LoginFormData, SignUpFormData } from "@/types/auth";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

export class AuthService {
  static async loginWithEmailAndPassword(data: LoginFormData): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async loginWithGoogle(): Promise<void> {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async signUpWithEmailAndPassword(data: SignUpFormData): Promise<void> {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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

  private static handleAuthError(error: unknown): AuthError {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "An unexpected error occurred" };
  }
}