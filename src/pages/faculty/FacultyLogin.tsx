// 📂 C:\Aman Raj\EduSangrah\src\pages\faculty\FacultyLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Home } from "lucide-react";

const FacultyLogin: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to backend
      const res = await axios.post(
        "http://localhost:5000/api/faculty/login",
        formData
      );

      // Save token & user info with role in localStorage
      localStorage.setItem("faculty_token", res.data.token);
      const userWithRole = { ...res.data.faculty, role: "faculty" };
      localStorage.setItem("faculty_user", JSON.stringify(userWithRole));

      toast.success("Login successful!");

      // Navigate to Faculty Dashboard
      navigate("/faculty/dashboard/home", { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Faculty Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/faculty/register")}
          >
            Register
          </span>
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

export default FacultyLogin;
