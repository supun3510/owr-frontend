import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // Roles allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType"); // Fetch stored user type

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType || "")) {
    return <Navigate to="/login" />; // Redirect if unauthorized
  }

  return children;
};

export default ProtectedRoute;
