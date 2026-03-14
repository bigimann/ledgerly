"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Calendar,
  DollarSign,
  FileText,
  LogOut,
  History,
  Menu,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: "Calendar", href: "/dashboard", icon: Calendar },
    { name: "Transactions", href: "/dashboard/transactions", icon: DollarSign },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMobileMenu && !target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMobileMenu]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto md:py-3 lg:py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {/* Logo */}
                <div className="shrink-0 flex items-center">
                  <Link
                    href="/dashboard"
                    className="text-2xl font-bold text-blue-600"
                  >
                    Ledgerly
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Hi, {user?.lastName}</span>
                </div>

                {/* Desktop: History & Logout */}
                <div className="hidden lg:flex items-center space-x-2">
                  <Link
                    href="/dashboard/history"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span>History</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Mobile: Hamburger Menu */}
                <div className="mobile-menu-container lg:hidden">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 text-gray-700 hover:text-gray-900"
                  >
                    {showMobileMenu ? (
                      <X className="w-6 h-6 cursor-pointer" />
                    ) : (
                      <Menu className="w-6 h-6 cursor-pointer" />
                    )}
                  </button>

                  {showMobileMenu && (
                    <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <Link
                        href="/dashboard/history"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        <History className="w-4 h-4" />
                        <span>History</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="sm:hidden bg-white border-b">
          <div className="flex overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex-1 text-center px-4 py-3 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                  <div className="mt-1">{item.name}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
