"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminNavbar({ pageTitle, onNavigate, isLoginPage = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    toast.success("Admin logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/admin/login");
    }, 1000);
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (onNavigate) onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ section, icon, label }) => (
    <button
      onClick={() => handleNavigation(section)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
        ${activeSection === section 
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
          : "text-gray-600 hover:bg-gray-100"}`}
    >
      <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: icon }} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (isLoginPage) {
    return (
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100">
        <div className="container-padding flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-display font-bold text-gradient">{pageTitle}</h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          )}
        </div>
      </header>
    );
  }

  const navItems = [
    {
      section: "dashboard",
      label: "Dashboard",
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
    },
    {
      section: "viewEvents",
      label: "View Events",
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    },
    {
      section: "manageUsers",
      label: "Manage Users",
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    },
  ];

  return (
    <div className="flex h-screen">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <nav className={`fixed lg:static inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-white/80 backdrop-blur-lg shadow-xl border-r border-gray-100 z-40`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-gradient">{pageTitle}</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.section}
                section={item.section}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <span className="w-5 h-5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}