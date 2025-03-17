"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleEventsClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to view events.", { duration: 3000 });
      router.push("/login");
    } else {
      router.push("/events");
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100">
      <div className="container-padding flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <h1 
            onClick={() => router.push("/Homepage")}
            className="text-2xl font-display font-bold cursor-pointer text-gradient hover:opacity-90 transition-opacity"
          >
            EventFlow
          </h1>
        </div>
        
        <nav className="flex items-center space-x-8">
          <button
            onClick={() => router.push("/Homepage")}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
          >
            Home
          </button>
          <button
            onClick={handleEventsClick}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
          >
            Events
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn-secondary hover:scale-102 transition-transform duration-200"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="btn-secondary hover:scale-102 transition-transform duration-200"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="btn-primary hover:scale-102 transition-transform duration-200"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
