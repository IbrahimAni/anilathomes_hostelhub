import { auth, db } from "@/config/firebase-admin";

export async function cleanupTestUsers() {
  try {
    const users = await auth.listUsers();
    const testUsers = users.users.filter((user) =>
      user.email?.includes("@wptest.com")
    );

    for (const user of testUsers) {
      await auth.deleteUser(user.uid);
      await db.collection("users").doc(user.uid).delete();
    }
  } catch (error) {
    console.error("Error cleaning up test users:", error);
  }
}
