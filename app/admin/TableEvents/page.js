"use client";

import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

export default function TableEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/get-events");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch events");
        }
        const data = await response.json();
        console.log("Raw API response:", data);
        setEvents(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleApprove = async (eventId) => {
    console.log("handleApprove called with eventId:", eventId);
    if (!eventId) {
      console.error("eventId is undefined!");
      throw new Error("Event ID is undefined");
    }
    try {
      const response = await fetch("/api/approve-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve event");
      }

      const data = await response.json();
      toast.success("Event approved successfully!", { duration: 3000 });

      const fetchResponse = await fetch("/api/get-events");
      if (!fetchResponse.ok) throw new Error("Failed to refresh events");
      const updatedEvents = await fetchResponse.json();
      setEvents(updatedEvents);
      setPage(1);
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error.message, { duration: 3000 });
    }
  };

  const handleReject = async (eventId) => {
    console.log("handleReject called with eventId:", eventId);
    if (!eventId) {
      console.error("eventId is undefined!");
      throw new Error("Event ID is undefined");
    }
    try {
      const response = await fetch("/api/reject-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject event");
      }

      toast.success("Event rejected successfully!", { duration: 3000 });

      const fetchResponse = await fetch("/api/get-events");
      if (!fetchResponse.ok) throw new Error("Failed to refresh events");
      const updatedEvents = await fetchResponse.json();
      setEvents(updatedEvents);
      setPage(1);
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error(error.message, { duration: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
        <div className="text-red-600 text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl font-semibold">{error}</p>
          <p className="text-gray-500 mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
        <p className="text-gray-600 text-center font-medium text-lg">
          No pending events found.
        </p>
      </div>
    );
  }

  const truncateText = (text, length = 50) => {
    if (!text) return "N/A";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Pending Events for Approval
        </h2>
        <p className="text-gray-600 font-medium">
          Total Events: {events.length}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
              >
                Event Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Event Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Event Location
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider hidden md:table-cell"
              >
                Event Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Event Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Booked By
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEvents.map((event, index) => (
              <tr
                key={event.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div
                    className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-[150px]"
                    data-tooltip-id={`name-${event.id}`}
                    data-tooltip-content={event.event_name || "N/A"}
                  >
                    {truncateText(event.event_name, 15)}
                  </div>
                  <Tooltip
                    id={`name-${event.id}`}
                    place="top"
                    effect="solid"
                    style={{ backgroundColor: "#4B5563", color: "#FFF", padding: "4px 8px", borderRadius: "4px" }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {event.event_date
                    ? new Date(event.event_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div
                    className="text-sm text-gray-600 truncate max-w-[100px] md:max-w-[120px]"
                    data-tooltip-id={`location-${event.id}`}
                    data-tooltip-content={event.event_location || "N/A"}
                  >
                    {truncateText(event.event_location, 10)}
                  </div>
                  <Tooltip
                    id={`location-${event.id}`}
                    place="top"
                    effect="solid"
                    style={{ backgroundColor: "#4B5563", color: "#FFF", padding: "4px 8px", borderRadius: "4px" }}
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 text-center hidden md:table-cell">
                  <div
                    className="text-sm text-gray-600 truncate max-w-[150px] md:max-w-[200px]"
                    data-tooltip-id={`desc-${event.id}`}
                    data-tooltip-content={event.event_description || "N/A"}
                  >
                    {truncateText(event.event_description, 20)}
                  </div>
                  <Tooltip
                    id={`desc-${event.id}`}
                    place="top"
                    effect="solid"
                    style={{ backgroundColor: "#4B5563", color: "#FFF", padding: "4px 8px", borderRadius: "4px" }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div
                    className="text-sm text-gray-600 truncate max-w-[120px] md:max-w-[150px]"
                    data-tooltip-id={`category-${event.id}`}
                    data-tooltip-content={event.event_category || "N/A"}
                  >
                    {truncateText(event.event_category, 15)}
                  </div>
                  <Tooltip
                    id={`category-${event.id}`}
                    place="top"
                    effect="solid"
                    style={{ backgroundColor: "#4B5563", color: "#FFF", padding: "4px 8px", borderRadius: "4px" }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div
                    className="text-sm text-gray-600 truncate max-w-[100px] md:max-w-[120px]"
                    data-tooltip-id={`email-${event.id}`}
                    data-tooltip-content={event.email || "N/A"}
                  >
                    {truncateText(event.email, 10)}
                  </div>
                  <Tooltip
                    id={`email-${event.id}`}
                    place="top"
                    effect="solid"
                    style={{ backgroundColor: "#4B5563", color: "#FFF", padding: "4px 8px", borderRadius: "4px" }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
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
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center space-x-2">
                  {event.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(event.id)}
                        className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
                        className="bg-red-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}