import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { auth } from "./firebase-admin";

export const cleanupAuthUser = onDocumentDeleted("users/{userId}", async (event) => {
  const userId = event.params.userId;

  try {
    await auth.deleteUser(userId);
    console.log(`Successfully deleted Auth user: ${userId}`);
  } catch (error) {
    console.error(`Error deleting Auth user ${userId}:`, error);
    // Add specific error handling for common cases
    if (error instanceof Error) {
      // Handle specific error codes
      const authError = error as { code?: string };
      
      if (authError.code === 'auth/user-not-found') {
        console.log(`User ${userId} was already deleted from Authentication.`);
      } else if (authError.code === 'auth/invalid-uid') {
        console.error(`Invalid user ID format: ${userId}`);
      }
    }
  }
});