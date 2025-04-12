"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FiHome, 
  FiUser, 
  FiBookmark, 
  FiClock, 
  FiCreditCard, 
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut
} from "react-icons/fi";
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { UserProfile } from "@/types/user";
import { AuthService } from "@/services/auth.service";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  testId?: string;
}

const NavItem = ({ href, icon, label, active, testId }: NavItemProps) => (
  <Link 
    href={href}
    className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
      active 
        ? "bg-blue-100 text-blue-700" 
        : "hover:bg-gray-100 text-gray-700"
    }`}
    data-testid={testId}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const userProfile = await UserService.getUserProfile(currentUser.uid);
          setUser(userProfile);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" data-testid="student-dashboard-layout">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed right-4 top-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-blue-500 text-white shadow-lg"
          data-testid="sidebar-toggle-button"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>
      
      {/* Sidebar - Made fixed with overflow-y-auto for scrolling within sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 lg:sticky lg:block overflow-hidden`}
        data-testid="student-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header section */}
          <div className="p-5 border-b">
            <div className="flex items-center justify-center mb-6">
              <Link 
                href="/dashboard/student" 
                className="text-xl font-bold text-blue-600"
                data-testid="dashboard-logo-link"
              >
                HostelHub
              </Link>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 relative mb-3">
                {user?.photoURL ? (
                  <Image 
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    fill
                    className="rounded-full object-cover"
                    data-testid="user-avatar"
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center"
                    data-testid="default-avatar"
                  >
                    <span className="text-blue-600 text-2xl font-semibold">
                      {user?.displayName?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-800" data-testid="user-display-name">
                {user?.displayName || "Student"}
              </h3>
              <p className="text-sm text-gray-500" data-testid="user-university">
                {user?.university || "University Student"}
              </p>
            </div>
          </div>
          
          {/* Navigation section - With its own scrollbar */}
          <nav className="flex-1 p-5 overflow-y-auto" data-testid="sidebar-nav">
            <NavItem 
              href="/dashboard/student" 
              icon={<FiHome size={18} />} 
              label="Dashboard"
              active={pathname === "/dashboard/student"}
              testId="nav-dashboard"
            />
            <NavItem 
              href="/dashboard/student/profile" 
              icon={<FiUser size={18} />} 
              label="My Profile"
              active={pathname === "/dashboard/student/profile"}
              testId="nav-profile"
            />
            <NavItem 
              href="/dashboard/student/favorites" 
              icon={<FiBookmark size={18} />} 
              label="Saved Hostels"
              active={pathname === "/dashboard/student/favorites"}
              testId="nav-favorites"
            />
            <NavItem 
              href="/dashboard/student/bookings" 
              icon={<FiClock size={18} />} 
              label="Bookings"
              active={pathname === "/dashboard/student/bookings"}
              testId="nav-bookings"
            />
            <NavItem 
              href="/dashboard/student/payments" 
              icon={<FiCreditCard size={18} />} 
              label="Payments"
              active={pathname === "/dashboard/student/payments"}
              testId="nav-payments"
            />
            <NavItem 
              href="/dashboard/student/settings" 
              icon={<FiSettings size={18} />} 
              label="Settings"
              active={pathname === "/dashboard/student/settings"}
              testId="nav-settings"
            />
          </nav>
          
          {/* Help section */}
          <div className="p-5 border-t">
            <div className="bg-blue-50 p-4 rounded-lg" data-testid="help-section">
              <h4 className="font-medium text-blue-700 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Having issues with your booking or account?
              </p>
              <Link 
                href="/support"
                className="text-sm text-blue-600 hover:underline"
                data-testid="support-link"
              >
                Contact Support
              </Link>
            </div>
          </div>
          
          {/* Logout button */}
          <div className="p-5 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              data-testid="logout-button"
            >
              <span className="mr-3"><FiLogOut size={18} /></span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Content - Scrollable area */}
      <main className="flex-1 p-5 lg:p-8 overflow-y-auto" data-testid="dashboard-content">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            data-testid="sidebar-overlay"
          />
        )}
        
        {/* Main content area */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}