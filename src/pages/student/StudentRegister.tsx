// 📂 C:\Aman Raj\EduSangrah\src\pages\student\StudentRegister.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "student" }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registration successful! Please login to continue.");
        navigate("/student/login", { replace: true });
      } else {
        setError(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Register failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Student Registration
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
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
            placeholder="Create Password"
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Already registered?{" "}
          <Link to="/student/login" className="text-primary font-semibold">
            Login here
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

export default StudentRegister;
