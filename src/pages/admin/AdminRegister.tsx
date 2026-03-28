import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/admin";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage("Registered successfully! Please login.");
      setTimeout(() => navigate("/admin/login"), 1500);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-96"
      >
        <h2 className="text-xl font-bold mb-4">Admin Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p className="text-red-500 mt-2">{message}</p>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-blue-600">
            Login
          </Link>
        </p>

        {/* ✅ Back to Home button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
