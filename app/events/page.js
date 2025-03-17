"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      toast.error("Please log in to view events.", { duration: 3000 });
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const parsedUserId = parseInt(user.id, 10);
      setUserId(parsedUserId || null);
      if (parsedUserId) {
        fetchEvents(parsedUserId);
      }
    }
  }, [router]);

  const fetchEvents = async (userId) => {
    try {
      const response = await fetch(`/api/events?user_id=${userId}`);
      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Failed to fetch events");
        } catch (parseError) {
          throw new Error(`Failed to fetch events: ${text}`);
        }
      }
      const data = await response.json();
      console.log("Fetched events data:", data); 
      setEvents(data);
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast.error(error.message, { duration: 3000 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen container-padding">
      <header className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-semibold text-gradient">
            EventFlow
          </h1>
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => router.push("/Homepage")}
              className="btn-secondary"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/events")}
              className="btn-secondary"
            >
              Events
            </button>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="btn-secondary"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="btn-primary"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-semibold text-gradient">
            Your Events
          </h2>
          <button
            onClick={() => router.push("/create")}
            className="btn-primary"
          >
            + Create New Event
          </button>
        </div>

        {events.length > 0 ? (
          <div className="space-y-4">
            <div className=" grid grid-cols-6 gap-6 p-4 bg-white/80 backdrop-blur-lg rounded-xl font-medium text-black">
              <div>Event Name</div>
              <div>Event Date</div>
              <div>Event Description</div>
              <div>Event Location</div>
              <div>Event Category</div>
              <div>Status</div>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id} 
                  className="card p-4 grid grid-cols-6 gap-6  cursor-pointer"
                >
                  <div className="font-medium text-gray-800">{event.event_name || "N/A"}</div>
                  <div className="text-gray-600">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                  <div className="text-gray-600 line-clamp-2">
                    {event.event_description || "N/A"}
                  </div>
                  <div className="text-gray-600">{event.event_location || "N/A"}</div>
                  <div className="text-gray-600">{event.event_category || "N/A"}</div>
                  <div className="text-gray-600">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${event.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : event.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : event.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"}`}
                    >
                      {event.status || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card text-center p-12">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No Events Yet</h3>
            <p className="text-gray-600 mb-8">
              Create your first event to get started!
            </p>
            <button
              onClick={() => router.push("/create")}
              className="btn-primary"
            >
              Create Your First Event
            </button>
          </div>
        )}
      </main>
    </div>
  );
}