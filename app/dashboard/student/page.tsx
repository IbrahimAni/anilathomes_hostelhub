"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { UserProfile } from "@/types/user";
import { FiBookmark, FiClock, FiCreditCard, FiArrowRight, FiBell, FiCalendar, FiHome, FiSearch, FiUser, FiX, FiCheck } from "react-icons/fi";

export default function StudentDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showModal, setShowModal] = useState(false); // Renamed from 'overlay' for clarity
  const [stats, setStats] = useState({
    favorites: 0,
    bookings: 0,
    payments: 0
  });
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if any of the required fields are missing
  const getProfileStatus = () => {
    if (!user) return { isComplete: false, missingFields: [] };
    
    const missingFields = [];
    if (!user.displayName) missingFields.push('displayName');
    if (!user.university) missingFields.push('university');
    if (!user.department) missingFields.push('department');
    if (!user.level) missingFields.push('level');
    
    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  };
  
  // Update profile status whenever user data changes
  useEffect(() => {
    if (user) {
      const { isComplete } = getProfileStatus();
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
        
        // Just set the user - the other useEffect will handle profile status
        setUser(userProfile);
        
        // Set stats based on profile completion
        const { isComplete } = getProfileStatus();
        
        if (!isComplete) {
          setStats({
            favorites: 0,
            bookings: 0,
            payments: 0
          });
        } else {
          setStats({
            favorites: 5,
            bookings: 2,
            payments: 3
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
  const profileStatus = getProfileStatus();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]" data-testid="loading-spinner">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 relative" data-testid="student-dashboard">
      {/* Welcome Section */}
      <div 
        className={`${
          isNewUser ? "bg-gradient-to-r from-purple-500 to-indigo-700" : "bg-gradient-to-r from-blue-500 to-blue-700"
        } rounded-xl p-8 text-white shadow-lg relative z-10`} 
        data-testid="welcome-section"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="welcome-heading">
              {isNewUser ? `Welcome to HostelHub, ${user?.displayName || 'Student'}` : `Welcome back, ${user?.displayName || 'Student'}`}
            </h1>
            <p className="text-blue-100 max-w-lg">
              {isNewUser 
                ? "Let's get started by completing your profile. Adding your full name helps us personalize your experience."
                : "Your one-stop dashboard for managing your hostel experience. Find, book, and manage your accommodations with ease."
              }
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={goToProfile}
              className={`px-5 py-3 ${
                isNewUser ? "bg-white text-purple-700 hover:bg-purple-50 font-bold" : "bg-white text-blue-700 hover:bg-blue-50 font-medium"
              } rounded-lg transition-colors shadow-md relative z-10`}
              data-testid="complete-profile-button"
            >
              {isNewUser ? "Complete Your Profile" : "View Profile"}
            </button>
          </div>
        </div>
        
        {/* Notification banner for new users */}
        {isNewUser && (
          <div className="mt-4 p-3 bg-white/20 rounded-lg flex items-center justify-between">
            <p className="text-white text-sm">
              <span className="font-bold">Complete your profile</span> to see personalized hostel recommendations based on your university.
            </p>
          </div>
        )}
      </div>
      
      {/* New User Modal - Only shown when profile is incomplete and on dashboard page */}
      {showModal && pathname === '/dashboard/student' && !profileStatus.isComplete && (
        <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50" data-testid="new-user-overlay">
          <div className="max-w-2xl w-full mx-4 bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Welcome to HostelHub!</h2>
                <button 
                  onClick={dismissModal}
                  className="text-white/80 hover:text-white"
                  data-testid="dismiss-overlay"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser size={40} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600">
                    Before you can explore and book hostels, we need to know your full name and university details. This helps us provide personalized recommendations for you.
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-purple-800 flex items-center gap-2">
                  <FiUser size={16} /> Required Information
                </h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-3">
                  <li className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="text-purple-500 font-bold">•</span> 
                      <span className="flex-1">Your <strong>full name</strong> helps us personalize your experience</span>
                    </span>
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.displayName ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="name-status">
                      {user?.displayName ? <FiCheck size={14} /> : <FiX size={14} />}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="text-purple-500 font-bold">•</span> 
                      <span className="flex-1">Your <strong>university</strong> helps us show relevant hostels nearby</span>
                    </span>
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.university ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="university-status">
                      {user?.university ? <FiCheck size={14} /> : <FiX size={14} />}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="text-purple-500 font-bold">•</span> 
                      <span className="flex-1">Your <strong>department and level</strong> help with roommate matching</span>
                    </span>
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.department && user?.level ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="dept-level-status">
                      {user?.department && user?.level ? <FiCheck size={14} /> : <FiX size={14} />}
                    </span>
                  </li>
                </ul>
                
                {/* Profile Completion Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Profile Completion</span>
                    <span>
                      {profileStatus.missingFields.length === 0 ? "100%" : 
                       `${Math.round((4 - profileStatus.missingFields.length) / 4 * 100)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${profileStatus.missingFields.length === 0 ? 100 : Math.round((4 - profileStatus.missingFields.length) / 4 * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={goToProfile}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition-colors"
                  data-testid="go-to-profile-button"
                >
                  Complete My Profile Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rest of dashboard - FIXED: Only disable when modal is shown */}
      <div className={showModal ? "opacity-20 pointer-events-none" : ""}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="stats-section">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow" data-testid="favorites-card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiBookmark className="text-blue-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Saved Hostels</p>
                <h3 className="text-2xl font-bold" data-testid="favorites-count">{stats.favorites}</h3>
              </div>
            </div>
            <Link 
              href="/dashboard/student/favorites"
              className="mt-4 flex items-center text-blue-500 text-sm font-medium hover:underline"
              data-testid="favorites-link"
            >
              {stats.favorites > 0 ? "View all saved hostels" : "Start saving hostels"}
              <FiArrowRight className="ml-1" size={14} />
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow" data-testid="bookings-card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <FiClock className="text-green-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Bookings</p>
                <h3 className="text-2xl font-bold" data-testid="bookings-count">{stats.bookings}</h3>
              </div>
            </div>
            <Link 
              href={stats.bookings > 0 ? "/dashboard/student/bookings" : "/hostels"}
              className="mt-4 flex items-center text-green-500 text-sm font-medium hover:underline"
              data-testid="bookings-link"
            >
              {stats.bookings > 0 ? "Manage your bookings" : "Browse hostels to book"}
              <FiArrowRight className="ml-1" size={14} />
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow" data-testid="payments-card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <FiCreditCard className="text-purple-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Payment History</p>
                <h3 className="text-2xl font-bold" data-testid="payments-count">{stats.payments}</h3>
              </div>
            </div>
            <Link 
              href="/dashboard/student/payments"
              className="mt-4 flex items-center text-purple-500 text-sm font-medium hover:underline"
              data-testid="payments-link"
            >
              {stats.payments > 0 ? "View payment history" : "Payment methods"}
              <FiArrowRight className="ml-1" size={14} />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - FIXED: Now uses activity count to determine display */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="recent-activity-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                {stats.bookings > 0 || stats.favorites > 0 || stats.payments > 0 ? (
                  <button 
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    data-testid="view-all-activity"
                  >
                    View All
                  </button>
                ) : null}
              </div>
              {stats.bookings === 0 && stats.favorites === 0 && stats.payments === 0 ? (
                <div className="text-center py-10" data-testid="no-activity">
                  <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                    <FiBell className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 mb-2">No recent activity</p>
                  <p className="text-sm text-gray-400">
                    Your recent activity will appear here after you start using HostelHub
                  </p>
                  <button 
                    onClick={() => router.push('/hostels')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    data-testid="explore-hostels-button"
                  >
                    Start Exploring Hostels
                  </button>
                </div>
              ) : (
                <div className="space-y-4" data-testid="activity-list">
                  <div className="border-l-4 border-blue-500 p-4 rounded-lg bg-blue-50" data-testid="activity-item-1">
                    <p className="font-medium">You booked a room at Lekki Gardens</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                  <div className="border-l-4 border-green-500 p-4 rounded-lg bg-green-50" data-testid="activity-item-2">
                    <p className="font-medium">You saved a hostel: Unilag Hostel 2</p>
                    <p className="text-sm text-gray-600">5 days ago</p>
                  </div>
                  <div className="border-l-4 border-purple-500 p-4 rounded-lg bg-purple-50" data-testid="activity-item-3">
                    <p className="font-medium">You made a payment for Lekki Gardens</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Upcoming Payments */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm h-full" data-testid="upcoming-payments-section">
              <h2 className="text-xl font-semibold mb-6">Upcoming Payments</h2>
              {stats.payments > 0 ? (
                <div className="space-y-4" data-testid="payments-list">
                  <div className="border-l-4 border-orange-500 p-4 rounded-lg bg-orange-50" data-testid="payment-item-1">
                    <p className="font-medium">Lekki Gardens - Room Balance</p>
                    <p className="text-sm text-gray-600 mb-2">Due in 3 days</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">₦50,000</span>
                      <button 
                        className="text-sm bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
                        data-testid="pay-now-button-1"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                  <div className="border-l-4 border-gray-400 p-4 rounded-lg bg-gray-50" data-testid="payment-item-2">
                    <p className="font-medium">Security Deposit</p>
                    <p className="text-sm text-gray-600 mb-2">Due in 14 days</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">₦25,000</span>
                      <button 
                        className="text-sm bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        data-testid="pay-now-button-2"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10" data-testid="no-payments">
                  <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                    <FiCreditCard className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 mb-2">No upcoming payments</p>
                  <p className="text-sm text-gray-400">
                    Payments will appear here after booking a hostel
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* For New Users: Getting Started Section */}
        {isNewUser && (
          <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="getting-started-section">
            <h2 className="text-xl font-semibold mb-6">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-1">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <FiUser size={24} className="text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Complete Your Profile</h3>
                <p className="text-sm text-gray-600 mb-4">Add your university and preferences to get personalized recommendations</p>
                <button 
                  onClick={() => router.push('/dashboard/student/profile')}
                  className="mt-auto px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Complete Profile
                </button>
              </div>
              <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-2">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <FiSearch size={24} className="text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Explore Hostels</h3>
                <p className="text-sm text-gray-600 mb-4">Browse hostels near your university and save your favorites</p>
                <button 
                  onClick={() => router.push('/hostels')}
                  className="mt-auto px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Find Hostels
                </button>
              </div>
              <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-3">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <FiHome size={24} className="text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Book Your Stay</h3>
                <p className="text-sm text-gray-600 mb-4">Secure your accommodation with our easy booking process</p>
                <button 
                  onClick={() => router.push('/hostels')}
                  className="mt-auto px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommended Hostels */}
        <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="recommended-hostels-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{isNewUser ? "Popular Hostels" : "Recommended Hostels"}</h2>
            <Link 
              href="/hostels"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              data-testid="view-all-hostels"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="hostels-grid">
            {[1, 2, 3].map((index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all" data-testid={`hostel-card-${index}`}>
                <div className="h-48 bg-gray-200 relative">
                  {index === 1 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">Unilag Hostel {index}</h3>
                    <div className="flex items-center text-yellow-500">
                      <span className="text-sm font-medium mr-1">4.{index}</span>
                      <span>★</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Akoka, Lagos</p>
                  <div className="flex items-center mt-2">
                    <div className="flex-1">
                      <p className="font-bold">₦150,000/year</p>
                      <p className="text-xs text-gray-500">Available now</p>
                    </div>
                    <button 
                      onClick={() => router.push(`/hostels/unilag-hostel-${index}`)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      data-testid={`view-hostel-${index}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FIXED: Profile Reminder Banner - Only show when profile is incomplete AND on non-dashboard pages AND modal is not showing */}
      {isNewUser && !profileStatus.isComplete && pathname !== '/dashboard/student' && pathname !== '/dashboard/student/profile' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-lg z-50" data-testid="profile-reminder-banner">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <FiUser className="text-white" size={20} />
              </div>
              <p className="text-white text-sm">
                <span className="font-semibold">Your profile is incomplete.</span> Complete your profile for the full HostelHub experience.
              </p>
            </div>
            <button 
              onClick={goToProfile}
              className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 ml-3 whitespace-nowrap"
            >
              Complete Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}