import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar.jsx";
import { AuthContext } from "../context/AuthContext";

function Home({ dark, setDark }) {
  const [activeDate, setActiveDate] = useState(15);
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${dark ? "bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-900"}`}>
      <Navbar dark={dark} setDark={setDark} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Book Your Appointments <br />
            <span className="text-blue-600">Easily</span>
          </h1>

          <p className={`text-base leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
            Avatar makes scheduling appointments simple. Find a suitable time, book your appointment, and manage everything from one place.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-red-500/20"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    dark ? "border-gray-800 bg-gray-900 text-gray-200 hover:bg-gray-800" : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Big Aesthetic Calendar Display */}
        <div className="lg:col-span-6">
          <div className={`p-6 rounded-3xl border shadow-xl ${dark ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800/20">
              <div>
                <h3 className="font-bold text-lg">September 2026</h3>
                <p className="text-xs text-gray-400">Select an open slot to schedule</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold">
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isSelected = activeDate === day;
                const isAvailable = [3, 8, 12, 15, 18, 22, 27].includes(day);

                return (
                  <button
                    key={day}
                    onClick={() => setActiveDate(day)}
                    className={`h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : isAvailable
                          ? dark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : dark ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    <span>{day}</span>
                    {isAvailable && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`mt-5 p-3.5 rounded-2xl border flex items-center justify-between ${
              dark ? "bg-gray-800/40 border-gray-800" : "bg-gray-50 border-gray-100"
            }`}>
              <div className="text-xs">
                <span className="text-gray-400 block">Selected Date</span>
                <span className="font-bold">Sept {activeDate}, 2026 • 10:30 AM</span>
              </div>
              <Link
                to={isAuthenticated ? "/booking" : "/login"}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Book Slot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 border-t border-gray-800/20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-7 border ${dark ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="text-3xl font-bold text-blue-600 mb-4">01</div>
            <h3 className="text-xl font-semibold mb-3">Choose a Service</h3>
            <p className={dark ? "text-gray-400" : "text-gray-500"}>Select the type of appointment you need from our options.</p>
          </div>

          <div className={`rounded-2xl p-7 border ${dark ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="text-3xl font-bold text-blue-600 mb-4">02</div>
            <h3 className="text-xl font-semibold mb-3">Pick a Time</h3>
            <p className={dark ? "text-gray-400" : "text-gray-500"}>Browse available dates and times and choose what works for you.</p>
          </div>

          <div className={`rounded-2xl p-7 border ${dark ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="text-3xl font-bold text-blue-600 mb-4">03</div>
            <h3 className="text-xl font-semibold mb-3">Manage Appointments</h3>
            <p className={dark ? "text-gray-400" : "text-gray-500"}>View and update your appointments directly from your account.</p>
          </div>
        </div>
      </section>

      {/* What Can You Book Section */}
      <section className="px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Can You Book?</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Consultations", desc: "Schedule a consultation at a time that fits your day." },
            { title: "Meetings", desc: "Organize meetings without the back-and-forth emails." },
            { title: "Appointments", desc: "Keep all your scheduled sessions organized in one place." }
          ].map((item, idx) => (
            <div key={idx} className={`p-7 rounded-2xl border ${
              dark ? "bg-blue-950/20 border-blue-900/30 text-blue-100" : "bg-blue-50 border-blue-100 text-blue-900"
            }`}>
              <h3 className="text-xl font-semibold text-blue-600 mb-3">{item.title}</h3>
              <p className={dark ? "text-gray-400" : "text-gray-600"}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-blue-600 text-white text-center px-6 py-16">
        <h2 className="text-3xl font-bold">Ready to book your appointment?</h2>
        <p className="mt-3 text-blue-100 max-w-xl mx-auto">Create an account and start scheduling in minutes.</p>
        <Link
          to={isAuthenticated ? "/booking" : "/register"}
          className="inline-block mt-6 bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl transition-all hover:bg-blue-50 shadow-lg"
        >
          {isAuthenticated ? "Book an Appointment" : "Get Started"}
        </Link>
      </section>
    </div>
  );
}

export default Home;