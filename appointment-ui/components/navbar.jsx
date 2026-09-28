import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar({ dark, setDark }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-200 ${
        dark ? "bg-[#0b0f19]/80 border-gray-800 text-white" : "bg-white/80 border-gray-200 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-wider text-blue-600">
          APPOINTMENTS
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold hover:text-blue-500 transition-colors">
                Dashboard
              </Link>

              {/* Show Admin Panel link only to Admin users */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/appointments"
                  className="text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20"
                >
                  Admin Panel
                </Link>
              )}

              <Link to="/profile" className="text-sm font-semibold hover:text-blue-500 transition-colors">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-blue-500 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-xs font-bold"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;