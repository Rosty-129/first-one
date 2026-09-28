import { useState, useEffect, useContext } from "react";
import Navbar from "./navbar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminAppointments({ dark, setDark }) {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const activeToken = token || localStorage.getItem("authtoken");

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5005/admin/appointments", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch admin appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch("http://localhost:5005/admin/appointments/aprove", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch("http://localhost:5005/admin/appointments/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5005/admin/appointments/reschedule", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          id: rescheduleModal.id,
          starttime: newStart,
          endtime: newEnd,
        }),
      });
      if (res.ok) {
        setRescheduleModal(null);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${dark ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar dark={dark} setDark={setDark} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-black mb-6">Admin Dashboard - Manage Appointments</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className={dark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}>
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Start Time</th>
                  <th className="p-4">End Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="p-4 font-bold">{apt.user ? `${apt.user.firstname} ${apt.user.lastname}` : `User #${apt.userid}`}</td>
                    <td className="p-4">{apt.user?.email || "N/A"}</td>
                    <td className="p-4">{new Date(apt.starttime).toLocaleString()}</td>
                    <td className="p-4">{new Date(apt.endtime).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        apt.status === "approved" ? "bg-green-500/20 text-green-400" :
                        apt.status === "canceled" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => handleApprove(apt.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setRescheduleModal(apt)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className={`p-6 rounded-xl max-w-md w-full ${dark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold mb-4">Reschedule Appointment #{rescheduleModal.id}</h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1">New Start Time</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded dark:bg-gray-800"
                    onChange={(e) => setNewStart(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">New End Time</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded dark:bg-gray-800"
                    onChange={(e) => setNewEnd(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleModal(null)}
                    className="px-4 py-2 text-sm bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAppointments;