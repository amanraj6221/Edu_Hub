import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "profile";

  const [formData, setFormData] = useState({
    firstName: "",
    rollNo: "",
    course: "",
    semester: "",
    branch: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    currentCity: "",
    homeCity: "",
    state: "",
    professionalSummary: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let value = e.target.value;

    // Allow only numbers for contact
    if (e.target.name === "contact") {
      value = value.replace(/\D/g, "");
    }

    // Limit professional summary to 3000 words
    if (e.target.name === "professionalSummary") {
      const words = value.split(/\s+/);
      if (words.length > 3000) {
        value = words.slice(0, 3000).join(" ");
      }
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim())
      return (alert("Please enter your full name"), false);
    if (!formData.email.trim())
      return (alert("Please enter your email"), false);
    if (!formData.contact.trim())
      return (alert("Please enter your contact number"), false);
    return true;
  };

  const handleSaveNext = async () => {
    if (!studentId)
      return alert("❌ Student ID not found. Please login again.");

    if (!validateForm()) return;

    try {
      setSaving(true);

      const body = new FormData();
      body.append("studentId", studentId);
      body.append("sectionId", sectionId);
      body.append("data", JSON.stringify(formData));

      if (files.photo) body.append("photo", files.photo);

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Profile saved successfully!");
        navigate("/student/dashboard/education");
      } else {
        alert(result.message || "❌ Failed to save profile");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Server error - Please try again");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchDraft = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/student/section/${sectionId}/${studentId}`
        );

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setFormData(result.data);
          }
        }
      } catch (err) {
        console.error("Fetch draft error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [studentId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Personal Profile
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "firstName", placeholder: "Full Name", required: true },
            { name: "rollNo", placeholder: "Roll Number", required: true },
            { name: "course", placeholder: "Course", required: true },
            { name: "semester", placeholder: "Semester", required: true },
            { name: "branch", placeholder: "Branch", required: true },
            {
              name: "dob",
              placeholder: "Date of Birth",
              type: "date",
              required: true,
            },
            {
              name: "gender",
              placeholder: "Gender",
              type: "select",
              required: true,
            },
            { name: "contact", placeholder: "Contact Number", required: true },
            {
              name: "email",
              placeholder: "Email",
              type: "email",
              required: true,
            },
            {
              name: "currentCity",
              placeholder: "Current City",
              required: true,
            },
            { name: "homeCity", placeholder: "Home City", required: true },
            { name: "state", placeholder: "State", required: true },
          ].map((field, idx) =>
            field.type === "select" ? (
              <select
                key={idx}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                required={field.required}
                className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            ) : (
              <input
                key={idx}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                required={field.required}
                className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )
          )}
        </div>

        {/* Professional Summary */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Professional Summary (Max 10 lines / 3000 words)
          </label>
          <textarea
            name="professionalSummary"
            value={formData.professionalSummary}
            onChange={handleChange}
            rows={10}
            placeholder="Write a brief professional summary..."
            className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <span className="text-gray-700 mb-2 font-medium">Photo</span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate("/student/dashboard/overview")}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          <button
            onClick={handleSaveNext}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {saving ? "Saving..." : "Save & Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
