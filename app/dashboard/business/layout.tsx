"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { BusinessProvider, useBusinessContext } from "@/context/BusinessContext";

// Create a separate component for the dashboard content
// This allows us to use the useBusinessContext hook inside
function BusinessDashboardContent({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { businessName, isDefaultName } = useBusinessContext();
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Set banner visibility based on whether we have a default business name
    setShowBanner(isDefaultName);
  }, [isDefaultName]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Overview", path: "/dashboard/business", icon: "chart-pie" },
    { name: "Properties", path: "/dashboard/business/properties", icon: "building" },
    { name: "Bookings", path: "/dashboard/business/bookings", icon: "calendar-alt" },
    { name: "Finances", path: "/dashboard/business/finances", icon: "money-bill-wave" },
    { name: "Agents", path: "/dashboard/business/agents", icon: "users" },
    { name: "Business Profile", path: "/dashboard/business/profile", icon: "user-tie" },
    { name: "Settings", path: "/dashboard/business/settings", icon: "cog" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-lg">
        <div className="px-6 pt-8 pb-4 flex flex-col">
          <h1 className="text-xl font-bold text-indigo-600">
            {businessName || "Business Name"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">HostelHub Business</p>
        </div>
        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex items-center px-4 py-3 text-sm rounded-lg ${
                  pathname === item.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={pathname === item.path ? "page" : undefined}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span
                  className={`mr-3 h-5 w-5 flex items-center justify-center ${
                    pathname === item.path
                      ? "text-indigo-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  <i className={`fas fa-${item.icon}`} aria-hidden="true"></i>
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <span className="mr-3 h-5 w-5 flex items-center justify-center">
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
            </span>
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-indigo-600">
              {businessName || "Business Name"}
            </h1>
            <p className="text-xs text-gray-500">HostelHub Business</p>
          </div>
          <button
            type="button"
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            data-testid="mobile-menu-button"
          >
            <span className="sr-only">Open main menu</span>
            <i
              className={`fas fa-${isMenuOpen ? "times" : "bars"}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-gray-800 bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition ease-in-out duration-300"
            onClick={(e) => e.stopPropagation()}
            id="mobile-menu"
          >
            <div className="px-6 pt-8 pb-4 flex flex-col">
              <h1 className="text-xl font-bold text-indigo-600">
                {businessName || "Business Name"}
              </h1>
              <p className="text-xs text-gray-500 mt-1">HostelHub Business</p>
              <button
                type="button"
                className="absolute top-4 right-4 p-2 text-gray-600 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                data-testid="close-mobile-menu"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <div className="px-4 py-2 space-y-1 overflow-y-auto">
              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`group flex items-center px-4 py-3 text-sm rounded-lg ${
                      pathname === item.path
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={pathname === item.path ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span
                      className={`mr-3 h-5 w-5 flex items-center justify-center ${
                        pathname === item.path
                          ? "text-indigo-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      <i
                        className={`fas fa-${item.icon}`}
                        aria-hidden="true"
                      ></i>
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="absolute bottom-0 w-full px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <span className="mr-3 h-5 w-5 flex items-center justify-center">
                  <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                </span>
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-64 flex-1 overflow-y-auto pb-10">
        <div className="md:hidden h-14"></div>
        
        {/* Business Name Banner */}
        {showBanner && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 mx-4 sm:mx-6 lg:mx-8 mt-4 relative">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <i className="fas fa-info-circle text-amber-500 text-lg"></i>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800">Personalize your dashboard</h3>
                <div className="mt-1 text-sm text-amber-700">
                  <p>You&apos;re currently using the default business name. Personalize your experience by setting your actual business name.</p>
                </div>
                <div className="mt-3">
                  <Link 
                    href="/dashboard/business/settings" 
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    <i className="fas fa-cog mr-1.5"></i> Update Business Name
                  </Link>
                </div>
              </div>
              <button 
                type="button" 
                className="absolute top-3 right-3 text-amber-500 hover:text-amber-700"
                onClick={() => setShowBanner(false)}
                aria-label="Close banner"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
        
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// The main layout component that wraps the content with the BusinessProvider
export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <BusinessDashboardContent>{children}</BusinessDashboardContent>
    </BusinessProvider>
  );
}
