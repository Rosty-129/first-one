import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./components/home.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Booking from "./components/booking.jsx";
import Profile from "./components/profile.jsx";
import AdminAppointments from "./components/appointments.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [dark, setDark] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
          <Route path="/login" element={<Login dark={dark} setDark={setDark} />} />
          <Route path="/register" element={<Register dark={dark} setDark={setDark} />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard dark={dark} setDark={setDark} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking dark={dark} setDark={setDark} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile dark={dark} setDark={setDark} />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAppointments dark={dark} setDark={setDark} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;