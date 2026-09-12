import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../components/home.jsx";
import Login from "../components/login.jsx";
import Register from "../components/register.jsx";
import Dashboard from "../components/Dashboard.jsx";
import Booking from "../components/booking.jsx";
import Appointments from "../components/appointments.jsx";
import Profile from "../components/profile.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function App() {
  const [dark, setDark] = useState(true);

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
        <Route path="/home" element={<Home dark={dark} setDark={setDark} />} />
        <Route path="/login" element={<Login dark={dark} setDark={setDark} />} />
        <Route path="/register" element={<Register dark={dark} setDark={setDark} />} />
        <Route path="/dashboard" element={<Dashboard dark={dark} setDark={setDark} />} />
        <Route path="/booking" element={<Booking dark={dark} setDark={setDark} />} />
        <Route path="/appointments/new" element={<Booking dark={dark} setDark={setDark} />} />
        <Route path="/appointments" element={<Appointments dark={dark} setDark={setDark} />} />
        <Route path="/profile" element={<Profile dark={dark} setDark={setDark} />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;