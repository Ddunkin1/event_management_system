"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    if (authStatus) {
      toast("You are already logged in. Redirecting to homepage...", {
        icon: "ℹ️", 
        duration: 3000,
        style: {
          background: "#e0f7fa",
          color: "#006064",
        },
      });
      setTimeout(() => router.push("/Homepage"), 1000);
    }
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

  const handleCreateEventClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to create an event.", { duration: 3000 });
      router.push("/login");
    } else {
      router.push("/create");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful! Welcome back!", { duration: 3000 });
      setTimeout(() => {
        router.push("/Homepage");
      }, 1000);
    } catch (error) {
      setError(error.message);
      toast.error(error.message, { duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen container-padding">
      <header className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-semibold text-gradient">
            EventJJC
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
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
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
      <main className="container-padding flex justify-center items-center ">
        <div className="bg-white/80 card w-full max-w-md p-8 bg-white shadow-md rounded-2xl backdrop-filter backdrop-blur-md bg-opacity-20">
          <h2 className="text-4xl font-display font-semibold tracking-tight text-gradient mb-8">
            Welcome Back
          </h2>
          {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>
            <div className="flex flex-col space-y-4">
              <button type="submit" className="btn-primary">
                Sign In
              </button>
              <p className="text-center text-gray-600">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}