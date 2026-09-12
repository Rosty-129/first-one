import { useState } from "react";
import Navbar from "./navbar.jsx";

function Booking({ dark, setDark }) {
  const [service, setService] = useState("Consultation");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // New state for handling the request feedback
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    try {
      // 1. Grab the token (adjust this if you store it under a different name)
      const token = localStorage.getItem("authtoken");
      
      if (!token) {
        setMessage("You must be logged in to book an appointment.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      // 2. Combine date and time into valid Date objects for the backend
      const startDateTime = new Date(`${date}T${time}`);
      
      // Let's assume an appointment lasts 1 hour. We add 1 hour (60*60*1000 ms) to start time.
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      // 3. Send the request to your Express backend
      const response = await fetch("http://localhost:5005/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          starttime: startDateTime.toISOString(),
          endtime: endDateTime.toISOString(),
          // service: service // Optional: Send this if your backend schema supports storing the service type
        }),
      });

      const data = await response.json();

      // 4. Handle success or failure
      if (response.ok) {
        setMessage("Booking successful! We have reserved your time slot.");
        setIsError(false);
        
        // Reset the form
        setDate("");
        setTime("");
        setService("Consultation");
      } else {
        // Backend sent an error (like "Time slot already booked" or outside 9-5)
        setMessage(data.message || "Failed to book appointment.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Network error. Please make sure the server is running.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-200 ${
      dark ? "bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-900"
    }`}>
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Book an Appointment</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>
            Select your service, date, and preferred time slot (between 9 AM and 5 PM).
          </p>
        </div>

        {/* Display Success or Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl animate-fade-in-up font-medium text-sm ${
            isError 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
          <div className={`p-6 rounded-2xl border ${dark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Service Type</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${
                    dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"
                  }`}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up Meeting">Follow-up Meeting</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${
                    dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${
                    dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 transform shadow-md ${
              isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 shadow-blue-500/20"
            }`}
          >
            {isLoading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;