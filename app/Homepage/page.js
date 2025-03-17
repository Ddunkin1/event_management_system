"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Homepage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const parsedUserId = parseInt(user.id, 10);
      setUserId(parsedUserId || null);
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

      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-semibold text-gradient mb-4">
            Welcome to EventFlow
          </h2>
          <p className="text-lg text-gray-600">
            Manage your events effortlessly with our intuitive platform.
          </p>
        </div>

        <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              View Events
            </h3>
            <p className="text-gray-600 mb-6">
              Browse and manage all upcoming events in one place.
            </p>
            <button
              onClick={() => router.push("/events")}
              className="btn-primary w-full"
            >
              Go to Events
            </button>
          </div>

          <div className="card">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Create Event
            </h3>
            <p className="text-gray-600 mb-6">
              Plan and create a new event with ease. Start now!
            </p>
            <button
              onClick={() => router.push("/create")}
              className="btn-primary w-full"
            >
              Create Event
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}