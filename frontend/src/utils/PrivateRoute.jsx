import React from "react";
import { Outlet, Navigate } from "react-router-dom";

/**
 * PrivateRoute - Protects routes based on authentication and user role
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 * Roles: SUPER_ADMIN, ADMIN (Branch Admin), AGENT
 */
const PrivateRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Debug logging
  console.log("PrivateRoute Check:", {
    token: !!token,
    userRole,
    allowedRoles,
  });

  // No token - redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // No role restriction - allow access
  if (allowedRoles.length === 0) {
    console.log("No role restriction, allowing access");
    return <Outlet />;
  }

  // Check if user has the required role
  if (allowedRoles.includes(userRole)) {
    console.log("Role matched, allowing access");
    return <Outlet />;
  }

  // User is authenticated but doesn't have the right role
  // Redirect to login page (they need to login with correct credentials)
  console.log("Role mismatch - redirecting to login:", {
    userRole,
    allowedRoles,
  });
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
