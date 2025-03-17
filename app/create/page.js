"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateEvent() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      toast.error("Please log in to create an event.", { duration: 3000 });
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const parsedUserId = parseInt(user.id, 10);
      setUserId(parsedUserId || null);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !userId) {
      toast.error("User not authenticated or ID missing.", { duration: 3000 });
      router.push("/login");
      return;
    }

    const formData = {
      event_name: e.target.elements["event_name"].value,
      event_date: e.target.elements["event_date"].value,
      event_description: e.target.elements["event_description"].value,
      event_location: e.target.elements["event_location"].value,
      event_category: e.target.elements["event_category"].value,
      user_id: userId,
    };

    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Failed to create event");
        } catch (parseError) {
          throw new Error(`Failed to create event: ${text}`);
        }
      }

      const data = await response.json();
      toast.success("Event created successfully! Awaiting admin approval (Pending).", {
        duration: 3000,
      });
      router.push("/events");
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
      toast.error(error.message, { duration: 3000 });
    }
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

      <main className="max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-semibold text-gradient mb-4">
              Create a New Event
            </h2>
            <p className="text-gray-600">
              Fill in the details below to create your event
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleCreateEvent}>
            <div>
              <label htmlFor="event_category" className="form-label">
                Event Category
              </label>
              <select
                id="event_category"
                name="event_category"
                className="input-field"
                required
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                <option value="Business Events">Business Events</option>
                <option value="Social Events">Social Events</option>
                <option value="Personal Events">Personal Events</option>
                <option value="Academic Events">Academic Events</option>
              </select>
            </div>

            <div>
              <label htmlFor="event_name" className="form-label">
                Event Name
              </label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                placeholder="Enter event name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="event_date" className="form-label">
                Event Date
              </label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="event_description" className="form-label">
                Event Description
              </label>
              <textarea
                id="event_description"
                name="event_description"
                placeholder="Enter event description"
                className="input-field min-h-[120px]"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="event_location" className="form-label">
                Event Location
              </label>
              <textarea
                id="event_location"
                name="event_location"
                placeholder="Enter event location"
                className="input-field min-h-[80px]"
                required
              ></textarea>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}