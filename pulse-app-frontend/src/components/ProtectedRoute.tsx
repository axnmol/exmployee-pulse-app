import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Role } from "../enums/role.enum"; // Corrected import path

interface ProtectedRouteProps {
  allowedRoles?: Role[]; // Optional: Specify roles allowed for this route
  children?: React.ReactNode; // Allow wrapping specific components if needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isLoading, token } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading indicator while checking auth status
    return <div>Loading...</div>;
  }

  // Check if user is logged in (token exists and user object is populated)
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    // Redirect to login page, saving the current location to redirect back later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if specific roles are required and if the user has one of them
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the required role
    // Redirect to an unauthorized page or back to a default page
    console.warn(
      `User role (${user.role}) not authorized for this route. Allowed: ${allowedRoles.join(", ")}`
    );
    // For simplicity, redirect to employee dashboard or login? Or show an Unauthorized component?
    // Redirecting back might cause loops if they land directly on unauthorized page.
    // Let's redirect to the employee dashboard as a fallback.
    return <Navigate to="/employee" replace />;
    // Or: return <Navigate to="/unauthorized" replace />; (if you create an Unauthorized page)
  }

  // If children are provided, render them (useful for wrapping layouts)
  // Otherwise, render the nested routes via <Outlet />
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
