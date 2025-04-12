"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserService } from "@/services/user.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not authenticated, redirect to login
        router.push("/login");
        return;
      }

      try {
        // Get user role from Firestore
        const userProfile = await UserService.getUserProfile(user.uid);
        
        if (!userProfile || !userProfile.role) {
          // User has no role set, redirect to role selection
          router.push("/select-role");
          return;
        }

        // Extract current dashboard from URL path
        // Path format: /dashboard/{role}
        const urlPathParts = pathname.split('/');
        const requestedRole = urlPathParts.length > 2 ? urlPathParts[2] : null;

        // Check if user is trying to access a dashboard that doesn't match their role
        if (requestedRole && requestedRole !== userProfile.role) {
          console.log(`Access denied: User with role ${userProfile.role} tried to access ${requestedRole} dashboard`);
          // Redirect to their correct dashboard
          router.push(`/dashboard/${userProfile.role}`);
          return;
        }

        // User is authorized to view this dashboard
        setIsLoading(false);

      } catch (error) {
        console.error("Error verifying user role:", error);
        // Handle error - redirect to login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}