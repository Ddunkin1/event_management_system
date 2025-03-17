"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../components/AdminNavbar";
import TableUsers from "../TableUsers/page";
import TableEvents from "../TableEvents/page";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem("isAdminAuthenticated") === "true";
      const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@gmail.com";

      if (authStatus && adminUser.email === adminEmail) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        fetchStats();
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [router]);

  const fetchStats = async () => {
    try {
      const [eventsResponse, usersResponse] = await Promise.all([
        fetch('/api/get-events'),
        fetch('/api/get-users')
      ]);

      const events = await eventsResponse.json();
      const users = await usersResponse.json();
      const currentDate = new Date();


      setStats({
        totalEvents: events.length,
        totalUsers: users.length,

      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleNavigate = (section) => {
    if (isAdmin) {
      setActiveSection(section);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600">You are not authorized to access this page. Please log in with admin credentials.</p>
            <button
              onClick={() => router.push("/admin/login")}
              className="btn-primary w-full"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex">
        <AdminNavbar pageTitle="Admin Dashboard" onNavigate={handleNavigate} isLoginPage={false} />
        <main className="flex-1 p-6 lg:p-8 ml-0 ">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-gray-900">Dashboard Overview</h2>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeSection === "viewEvents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-gray-900">All Events</h2>
                <div className="text-sm text-gray-500">
                  Total Events: {stats.totalEvents}
                </div>
              </div>
              <TableEvents />
            </div>
          )}

          {activeSection === "manageUsers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-gray-900">Manage Users</h2>
                <div className="text-sm text-gray-500">
                  Total Users: {stats.totalUsers}
                </div>
              </div>
              <TableUsers />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}