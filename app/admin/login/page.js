"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    try {
      if (formData.email === adminEmail && formData.password === adminPassword) {
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminUser", JSON.stringify({ email: adminEmail }));
        toast.success("Admin login successful! Redirecting to dashboard.", {
          duration: 3000,
        });
        setTimeout(() => {
          router.push("/admin/AdminDashboard");
        }, 1000);
      } else {
        throw new Error("Invalid admin email or password");
      }
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
            EventFlow Admin
          </h1>
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => router.push("/Homepage")}
              className="btn-secondary"
            >
              Main Site
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-semibold text-gradient mb-4">
              Admin Login
            </h2>
            <p className="text-gray-600">
              Access the admin dashboard to manage events
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter admin email"
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
                placeholder="Enter admin password"
                className="input-field"
                required
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                Sign In as Admin
              </button>
              <p className="text-center mt-6 text-gray-600">
                Not an admin?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  User Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}