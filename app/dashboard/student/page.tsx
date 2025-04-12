"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { UserProfile } from "@/types/user";

// Import our extracted components
import { WelcomeSection } from "@/components/dashboard/student/WelcomeSection";
import { StatsCards } from "@/components/dashboard/student/StatsCards";
import { RecentActivity } from "@/components/dashboard/student/RecentActivity";
import { ProfileSetupModal } from "@/components/dashboard/student/ProfileSetupModal";
import { UpcomingPayments } from "@/components/dashboard/student/UpcomingPayments";
import { GettingStartedSection } from "@/components/dashboard/student/GettingStartedSection";
import { RecommendedHostels } from "@/components/dashboard/student/RecommendedHostels";
import { ProfileReminderBanner } from "@/components/dashboard/student/ProfileReminderBanner";

// Import our services
import { ProfileService } from "@/services/profile.service";
import { ActivityService } from "@/services/activity.service";

// Create a container component for consistent section spacing
const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`mb-8 ${className}`}>
    {children}
  </div>
);

export default function StudentDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true); // Default to true for cleaner initial state
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    favorites: 0,
    bookings: 0,
    payments: 0
  });
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Update profile status whenever user data changes
  useEffect(() => {
    if (user) {
      const { isComplete } = ProfileService.getProfileStatus(user);
      setIsNewUser(!isComplete);
      
      // Also update modal visibility based on profile completion
      if (isComplete) {
        setShowModal(false);
      } else if (pathname === '/dashboard/student') {
        setShowModal(true);
      }
    }
  }, [user, pathname]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        const userProfile = await UserService.getUserProfile(currentUser.uid);
        if (!userProfile) {
          router.push('/login');
          return;
        }
        
        // Set the user
        setUser(userProfile);
        
        // Get profile status
        const { isComplete } = ProfileService.getProfileStatus(userProfile);
        
        // For a clean dashboard, only fetch real stats for complete profiles
        // and when we have confirmed data exists
        if (isComplete) {
          // Check if user has any activity before showing stats
          const activityStats = await ActivityService.getActivityStats();
          const hasAnyActivity = Object.values(activityStats).some(count => count > 0);
          
          if (hasAnyActivity) {
            setStats({
              favorites: activityStats.favorite,
              bookings: activityStats.booking,
              payments: activityStats.payment
            });
          } else {
            // Keep default zeros for a clean dashboard
            setStats({
              favorites: 0,
              bookings: 0,
              payments: 0
            });
          }
        } else {
          // For new users, ensure stats are zeros
          setStats({
            favorites: 0,
            bookings: 0,
            payments: 0
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router, pathname]);
  
  // Dismiss modal
  const dismissModal = () => {
    setShowModal(false);
  };
  
  // Navigate to profile page
  const goToProfile = () => {
    router.push('/dashboard/student/profile');
  };
  
  // Get current profile status
  const profileStatus = ProfileService.getProfileStatus(user);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]" data-testid="loading-spinner">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-0 relative" data-testid="student-dashboard">
      {/* Welcome Section with larger top margin */}
      <SectionContainer className="mt-4">
        <WelcomeSection user={user} isNewUser={isNewUser} />
      </SectionContainer>
      
      {/* New User Modal - Only shown when profile is incomplete and on dashboard page */}
      {showModal && pathname === '/dashboard/student' && !profileStatus.isComplete && (
        <ProfileSetupModal
          user={user}
          showModal={showModal}
          profileStatus={profileStatus}
          dismissModal={dismissModal}
        />
      )}
      
      {/* Rest of dashboard - Only disable when modal is shown */}
      <div className={showModal ? "opacity-20 pointer-events-none" : ""}>
        {/* Stats Cards */}
        <SectionContainer>
          <StatsCards stats={stats} />
        </SectionContainer>
        
        {/* For New Users: Show Getting Started Section instead of activity/payments */}
        {isNewUser ? (
          <SectionContainer>
            <GettingStartedSection />
          </SectionContainer>
        ) : (
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <RecentActivity limit={3} />
              </div>
              
              {/* Upcoming Payments */}
              <div className="lg:col-span-1">
                <UpcomingPayments limit={2} />
              </div>
            </div>
          </SectionContainer>
        )}
        
        {/* Recommended Hostels */}
        <SectionContainer>
          <RecommendedHostels isNewUser={isNewUser} limit={3} />
        </SectionContainer>
      </div>
      
      {/* Profile Reminder Banner - Only show when profile is incomplete AND on non-dashboard pages AND modal is not showing */}
      {isNewUser && !profileStatus.isComplete && pathname !== '/dashboard/student' && pathname !== '/dashboard/student/profile' && (
        <ProfileReminderBanner onCompleteProfile={goToProfile} />
      )}
    </div>
  );
}