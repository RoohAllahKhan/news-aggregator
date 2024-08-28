import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  return isLoggedIn() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;