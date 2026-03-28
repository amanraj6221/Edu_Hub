// C:\Aman Raj\EduSangrah\src\pages\faculty\FacultyRegister.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Lock, Briefcase, Home } from "lucide-react";

const FacultyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/faculty/register", formData);
      toast.success("Faculty registered successfully!");
      navigate("/faculty/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Faculty Registration
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Create your faculty account to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <User className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Department */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Briefcase className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/faculty/login")}
          >
            Login
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

export default FacultyRegister;
