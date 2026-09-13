import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar({ dark, setDark }) {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Booking", path: "/booking" },
    { name: "My Appointments", path: "/appointments" },
    { name: "My Profile", path: "/profile" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-colors duration-200 ${
        dark
          ? "bg-[#0b0f19]/90 border-gray-800 text-gray-100"
          : "bg-white/90 border-gray-200 text-gray-900"
      } backdrop-blur-md`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-black text-xl tracking-tight">
          Av<span className="text-blue-600">atar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={isAuthenticated ? link.path : "/login"}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white"
                  : dark
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
              dark
                ? "border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="hidden sm:inline">
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </span>
            <span className="sm:hidden">{dark ? "☀️" : "🌙"}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t ${dark ? "border-gray-800 bg-[#0b0f19]" : "border-gray-200 bg-white"}`}>
          <div className="px-6 py-4 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={isAuthenticated ? link.path : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : dark
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;