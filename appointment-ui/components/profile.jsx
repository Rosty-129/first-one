import { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";

function Profile({ dark, setDark }) {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    date: "",
    phone: "",
    location: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) {
          setMessage({ type: "error", text: "You must be logged in to view your profile." });
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5005/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            email: data.email || "",
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
            phone: data.phone || "",
            location: data.location || "",
          });
        } else {
          setMessage({ type: "error", text: "Failed to load user profile." });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage({ type: "error", text: "Server connection failed." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwords.new && passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    try {
      const token = localStorage.getItem("authtoken");
      const payload = { ...userData };

      if (passwords.new) {
        payload.currentPassword = passwords.current;
        payload.newPassword = passwords.new;
      }

      const response = await fetch("http://localhost:5005/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile settings saved successfully!" });
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ type: "error", text: "An error occurred while saving." });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 text-center ${dark ? "bg-[#0b0f19] text-white" : "bg-[#f8fafc] text-gray-900"}`}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-200 ${dark ? "bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-900"}`}>
      <Navbar dark={dark} setDark={setDark} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-1">Profile & Settings</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>Manage your personal information and account security.</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className={`p-6 rounded-2xl border ${dark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={userData.firstname}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={userData.lastname}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Date of Birth</label>
                  <input
                    type="date"
                    name="date"
                    value={userData.date}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="+213..."
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={userData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${dark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Leave these blank if you do not want to change your password.</p>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="New password"
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirm password"
                    className={`w-full p-3 text-sm rounded-xl border outline-none transition-all ${dark ? "bg-gray-800/60 border-gray-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;