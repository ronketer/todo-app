// ProtectedRoute component - guards routes that require authentication
// If user is NOT logged in (no token), redirect to /login
// If user IS logged in, show the requested page (children)

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // Get token from AuthContext
  
  // If no token exists, user is not logged in - redirect to login page
  // 'replace' means replace history entry so back button doesn't loop
  return token ? children : <Navigate to="/login" replace />;
}
