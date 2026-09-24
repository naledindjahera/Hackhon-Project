import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they tried to access
    return <Navigate to="/login" replace />;
  }
  
  return children;
}