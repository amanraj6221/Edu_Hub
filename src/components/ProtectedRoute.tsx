import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "student" | "faculty" | "admin"; // ✅ Added "admin"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  let token: string | null = null;
  let user: any = null;

  try {
    // ✅ Get token & user info from localStorage based on role
    if (role === "faculty") {
      token = localStorage.getItem("faculty_token");
      user = JSON.parse(localStorage.getItem("faculty_user") || "null");
    } else if (role === "student") {
      token = localStorage.getItem("student_token");
      user = JSON.parse(localStorage.getItem("student_user") || "null");
    } else if (role === "admin") {
      // ✅ Admin logic added
      token = localStorage.getItem("admin_token");
      user = JSON.parse(localStorage.getItem("admin_user") || "null");
    }
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    token = null;
    user = null;
  }

  if (!token) {
    if (role === "faculty") return <Navigate to="/faculty/login" replace />;
    if (role === "student") return <Navigate to="/student/login" replace />;
    if (role === "admin") return <Navigate to="/admin/login" replace />; // ✅ Admin redirect
    return <Navigate to="/" replace />;
  }

  if (role && user?.role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
