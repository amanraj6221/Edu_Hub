// ExperienceSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  skills: string;
  experienceLetter?: File | null;
}

const ExperienceSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "experience";

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "",
      position: "",
      duration: "",
      description: "",
      skills: "",
      experienceLetter: null,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...experiences];
    (updated[index] as any)[name] = value;
    setExperiences(updated);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...experiences];
      updated[index].experienceLetter = e.target.files[0];
      setExperiences(updated);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        duration: "",
        description: "",
        skills: "",
        experienceLetter: null,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleSaveNext = async () => {
    if (!studentId) {
      alert("❌ Student ID not found. Please login again.");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("studentId", studentId);
      body.append("sectionId", sectionId);
      body.append(
        "data",
        JSON.stringify(
          experiences.map((exp) => ({
            company: exp.company,
            position: exp.position,
            duration: exp.duration,
            description: exp.description,
            skills: exp.skills,
          }))
        )
      );

      experiences.forEach((exp, idx) => {
        if (exp.experienceLetter) {
          body.append(`experienceLetter_${idx}`, exp.experienceLetter);
        }
      });

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Experience details saved successfully!");
        navigate("/student/dashboard/skills");
      } else {
        alert(result.message || "❌ Failed to save experience details");
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
            setExperiences(
              result.data.length
                ? result.data.map((exp: any) => ({
                    ...exp,
                    experienceLetter: null,
                  }))
                : experiences
            );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Work Experience
        </h2>

        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="mb-6 border border-gray-200 p-4 rounded-xl relative"
          >
            {experiences.length > 1 && (
              <button
                onClick={() => removeExperience(idx)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                ✕
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "company", placeholder: "Company/Organization" },
                { name: "position", placeholder: "Position/Role" },
                { name: "duration", placeholder: "Duration (e.g., 2 years)" },
                { name: "skills", placeholder: "Skills used/learned" },
              ].map((field, i) => (
                <input
                  key={i}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={(exp as any)[field.name]}
                  onChange={(e) => handleChange(idx, e)}
                  className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <textarea
              name="description"
              placeholder="Job Description & Responsibilities"
              value={exp.description}
              onChange={(e) => handleChange(idx, e)}
              rows={4}
              className="mt-4 w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="mt-4">
              <label className="flex flex-col">
                <span className="text-gray-700 mb-2 font-medium">
                  Experience Letter (if any)
                </span>
                <input
                  type="file"
                  name="experienceLetter"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileChange(idx, e)}
                  className="p-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          + Add More Experience
        </button>

        <div className="flex justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate("/student/dashboard/education")}
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

export default ExperienceSection;
