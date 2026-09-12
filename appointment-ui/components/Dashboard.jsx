import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function Dashboard({ dark, setDark }) {
  const { token } = useContext(AuthContext);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fallback to localStorage if context hasn't hydrated yet
        const activeToken = token || localStorage.getItem("authtoken");

        if (!activeToken) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("http://localhost:5005/appointment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status ${response.status}`);
        }

        const data = await response.json();
        const appointmentsArray = Array.isArray(data) ? data : data ? [data] : [];
        setUpcoming(appointmentsArray);
      } catch (err) {
        if (err.name === "TypeError") {
          setError("Cannot connect to backend server. Make sure it is running on port 5005.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-200 ${
        dark ? "bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-900"
      }`}
    >
      <Navbar dark={dark} setDark={setDark} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
              Welcome back
            </h1>
            <p className={dark ? "text-gray-400" : "text-gray-500"}>
              Here is what is happening today.
            </p>
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            + New Booking
          </Link>
        </div>

        <div
          className={`p-6 rounded-2xl border animate-fade-in-up ${
            dark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h2 className="text-xl font-bold mb-6">Upcoming Schedule</h2>

          <div className="space-y-4">
            {loading ? (
              <p className={dark ? "text-gray-400" : "text-gray-500"}>Loading appointments...</p>
            ) : error ? (
              <p className="text-red-500 text-sm font-medium">Error: {error}</p>
            ) : upcoming.length === 0 ? (
              <p className={dark ? "text-gray-400" : "text-gray-500"}>No upcoming appointments scheduled.</p>
            ) : (
              upcoming.map((apt) => {
                const startDate = new Date(apt.starttime);
                const isValidDate = !isNaN(startDate.getTime());

                const dateStr = isValidDate
                  ? startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                const timeStr = isValidDate
                  ? startDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "N/A";

                const statusText = apt.status
                  ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1)
                  : "Confirmed";

                const isPending = apt.status?.toLowerCase() === "pending";

                return (
                  <div
                    key={apt.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                      dark
                        ? "bg-gray-800/40 border-gray-800 hover:border-gray-700"
                        : "bg-gray-50 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-lg mb-1">Consultation</p>
                      <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        {dateStr} • {timeStr}
                      </p>
                    </div>
                    <span
                      className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto transition-transform hover:scale-105 ${
                        isPending
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;