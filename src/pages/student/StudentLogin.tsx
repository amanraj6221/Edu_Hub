// 📂 src/pages/student/StudentLogin.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Home } from "lucide-react";

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "student" }),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        // ✅ Store token with key matching ProtectedRoute
        localStorage.setItem("student_token", data.token);

        // ✅ Store user info with role key matching ProtectedRoute
        const userWithRole = { ...data.user, role: "student" };
        localStorage.setItem("student_user", JSON.stringify(userWithRole));

        toast.success("Login successful!");

        // ✅ Navigate to student dashboard overview
        navigate("/student/dashboard/overview", { replace: true });
      } else {
        setError(data.msg || "Invalid credentials");
        toast.error(data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Student Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-white font-semibold py-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/student/register" className="text-primary font-semibold">
            Register here
          </Link>
        </p>

        {/* ✅ Back to Home Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
