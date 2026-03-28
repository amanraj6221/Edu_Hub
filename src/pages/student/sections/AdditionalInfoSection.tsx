// AdditionalInfoSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface InfoEntry {
  hobbies: string;
  achievements: string;
  strengths: string;
  careerGoals: string;
  languages: string;
  references: string;
}

const AdditionalInfoSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "additionalInfo";

  const [entries, setEntries] = useState<InfoEntry[]>([
    {
      hobbies: "",
      achievements: "",
      strengths: "",
      careerGoals: "",
      languages: "",
      references: "",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

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
          if (result.success && result.data && result.data.length > 0) {
            setEntries(result.data);
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

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setEntries(updated);
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        hobbies: "",
        achievements: "",
        strengths: "",
        careerGoals: "",
        languages: "",
        references: "",
      },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const validateForm = () => {
    for (let entry of entries) {
      if (
        !entry.hobbies.trim() &&
        !entry.achievements.trim() &&
        !entry.strengths.trim()
      ) {
        alert(
          "Please fill at least Hobbies, Achievements, or Strengths for each entry."
        );
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
      body.append("data", JSON.stringify(entries));

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Additional info saved successfully!");
        navigate("/student/dashboard/final-submit");
      } else {
        alert(result.message || "❌ Failed to save additional info");
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
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Additional Information
        </h2>

        {/* Summary Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Summary</h3>
          {entries.length === 0 ? (
            <p className="text-gray-500">No additional info added yet.</p>
          ) : (
            <ul className="space-y-3">
              {entries.map((e, idx) => (
                <li
                  key={idx}
                  className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Hobbies: {e.hobbies || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Achievements: {e.achievements || "N/A"}
                    </p>
                    <p className="text-gray-700 mt-1">
                      Strengths: {e.strengths || "N/A"}
                    </p>
                    <p className="text-gray-700 mt-1">
                      Career Goals: {e.careerGoals || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveEntry(idx)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info Forms */}
        {entries.map((e, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl p-6 mb-6 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "hobbies", placeholder: "Hobbies & Interests" },
                { name: "achievements", placeholder: "Achievements & Awards" },
                { name: "strengths", placeholder: "Key Strengths" },
                { name: "languages", placeholder: "Languages Known" },
                {
                  name: "references",
                  placeholder: "References (Name, Contact, Relation)",
                },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={e[field.name as keyof InfoEntry]}
                  onChange={(ev) => handleChange(idx, ev)}
                  className="border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <textarea
              name="careerGoals"
              placeholder="Career Goals & Aspirations"
              value={e.careerGoals}
              onChange={(ev) => handleChange(idx, ev)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddEntry}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + Add Additional Info
        </button>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/volunteer")}
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

export default AdditionalInfoSection;
