import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;