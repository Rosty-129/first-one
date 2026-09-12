import { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";

function Appointments({ dark, setDark }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authtoken");

      if (!token) {
        setError("You must be logged in to view your appointments.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5005/appointment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load appointments");
      }

      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Unable to load appointments. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem("authtoken");

      const response = await fetch(`http://localhost:5005/appointment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel on server");
      }

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" } : apt))
      );
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert(`Could not cancel appointment: ${err.message}`);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Pending";

  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-200 ${
        dark ? "bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-900"
      }`}
    >
      <Navbar dark={dark} setDark={setDark} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">My Appointments</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>
            Manage your upcoming and past bookings.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-700 border border-red-200 font-medium text-sm animate-fade-in-up">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 opacity-60 animate-pulse">
            Loading your appointments...
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt, index) => {
              const formattedStatus = capitalize(apt.status);
              const isCancelable =
                formattedStatus === "Pending" || formattedStatus === "Confirmed";

              return (
                <div
                  key={apt.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`animate-fade-in-up p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                    dark
                      ? "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                      : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-bold text-xl mb-1">
                      {apt.service || "Appointment Slot"}
                    </p>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {formatDate(apt.starttime)} at {formatTime(apt.starttime)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-transform duration-300 hover:scale-105 ${
                        formattedStatus === "Confirmed"
                          ? dark
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-green-100 text-green-700"
                          : formattedStatus === "Pending"
                          ? dark
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-yellow-100 text-yellow-700"
                          : formattedStatus === "Cancelled"
                          ? dark
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-red-100 text-red-700"
                          : dark
                          ? "bg-gray-800 text-gray-400 border border-gray-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formattedStatus}
                    </span>

                    {isCancelable && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {appointments.length === 0 && !error && (
              <p className="text-center py-12 opacity-50 font-medium">
                No appointments found. Book one to get started!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;