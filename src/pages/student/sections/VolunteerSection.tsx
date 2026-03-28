// VolunteerSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface VolunteerEntry {
  organization: string;
  role: string;
  cause: string;
  duration: string;
  skillsUsed: string;
  description: string;
  certificate: File | null;
}

const VolunteerSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "volunteer";

  const [volunteers, setVolunteers] = useState<VolunteerEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

  // Fetch draft data
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
            setVolunteers(result.data);
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

  // Handle input changes
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = [...volunteers];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setVolunteers(updated);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...volunteers];
      updated[index].certificate = e.target.files[0];
      setVolunteers(updated);
    }
  };

  const handleAddVolunteer = () => {
    setVolunteers([
      ...volunteers,
      {
        organization: "",
        role: "",
        cause: "",
        duration: "",
        skillsUsed: "",
        description: "",
        certificate: null,
      },
    ]);
  };

  const handleRemoveVolunteer = (index: number) => {
    const updated = [...volunteers];
    updated.splice(index, 1);
    setVolunteers(updated);
  };

  const validateForm = () => {
    for (let v of volunteers) {
      if (!v.organization.trim() || !v.role.trim()) {
        alert("Organization and Role are required for each volunteer entry.");
        return false;
      }
    }
    return true;
  };

  const handleSaveNext = async () => {
    if (!studentId) {
      alert("❌ Student ID not found. Please login again.");
      return;
    }

    if (!validateForm()) return;

    try {
      setSaving(true);
      const body = new FormData();
      body.append("studentId", studentId);
      body.append("sectionId", sectionId);
      body.append(
        "data",
        JSON.stringify(
          volunteers.map((v) => ({ ...v, certificate: undefined }))
        )
      );

      volunteers.forEach((v, idx) => {
        if (v.certificate) body.append(`certificate_${idx}`, v.certificate);
      });

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Volunteer work saved successfully!");
        navigate("/student/dashboard/additional-info");
      } else {
        alert(result.message || "❌ Failed to save volunteer work");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Server error - Please try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Volunteer Work
        </h2>

        {/* Summary Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Volunteer Summary
          </h3>
          {volunteers.length === 0 ? (
            <p className="text-gray-500">No volunteer experiences added yet.</p>
          ) : (
            <ul className="space-y-3">
              {volunteers.map((v, idx) => (
                <li
                  key={idx}
                  className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {v.role} at {v.organization}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {v.duration} | Cause: {v.cause || "N/A"}
                    </p>
                    <p className="text-gray-700 mt-1">{v.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveVolunteer(idx)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Volunteer Forms */}
        {volunteers.map((v, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl p-6 mb-6 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "organization",
                  placeholder: "Organization Name",
                  required: true,
                },
                {
                  name: "role",
                  placeholder: "Your Role/Position",
                  required: true,
                },
                {
                  name: "cause",
                  placeholder: "Cause/Area (e.g., Education, Environment)",
                },
                { name: "duration", placeholder: "Duration (e.g., 6 months)" },
                { name: "skillsUsed", placeholder: "Skills Used/Developed" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={v[field.name as keyof VolunteerEntry] as string}
                  onChange={(e) => handleChange(idx, e)}
                  required={field.required}
                  className="border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <textarea
              name="description"
              placeholder="Description of Volunteer Work & Impact"
              value={v.description}
              onChange={(e) => handleChange(idx, e)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            />

            <div className="mt-4">
              <label className="flex flex-col">
                <span className="text-gray-700 mb-2 font-medium">
                  Volunteer Certificate (if any)
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileChange(idx, e)}
                  className="p-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddVolunteer}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + Add Volunteer Experience
        </button>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/social-links")}
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

export default VolunteerSection;
