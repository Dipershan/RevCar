// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to={isAdmin ? "/adminlogin" : "/login"} />;
  if (isAdmin && user?.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
