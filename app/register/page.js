"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let phoneNumber = e.target.phone_number.value;
    const internationalPhoneRegex = /^\+639\d{9}$/;
    const localPhoneRegex = /^09\d{9}$/;

    if (localPhoneRegex.test(phoneNumber)) {
      phoneNumber = `+63${phoneNumber.slice(1)}`;
    }

    if (phoneNumber && !internationalPhoneRegex.test(phoneNumber)) {
      setError("Invalid phone number format (e.g., +639123456789 or 09123456789)");
      toast.error("Invalid phone number format", { duration: 3000 });
      return;
    }

    const formData = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phone_number: phoneNumber,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registration successful! Please log in.", {
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/login");
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
            <button
              onClick={() => router.push("/create")}
              className="btn-primary"
            >
              + Create Event
            </button>
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
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-semibold text-gradient mb-4">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join EventFlow to start managing your events
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Enter your first name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Enter your last name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
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

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                placeholder="+639123456789 or 09123456789"
                className="input-field"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>
              <p className="text-center mt-6 text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}