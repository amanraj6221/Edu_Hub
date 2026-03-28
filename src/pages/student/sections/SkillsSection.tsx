// SkillsSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SkillSection {
  name: string;
  items: string[];
}

const SkillsSection: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "skills";

  const [skillsData, setSkillsData] = useState<SkillSection[]>([
    { name: "Technical Skills", items: [] },
    { name: "Programming Languages", items: [] },
    { name: "Tools & Frameworks", items: [] },
    { name: "Soft Skills", items: [] },
    { name: "Certifications", items: [] },
  ]);

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  const handleAddItem = (sectionName: string) => {
    const value = inputValues[sectionName]?.trim();
    if (!value) return;
    setSkillsData((prev) =>
      prev.map((sec) =>
        sec.name === sectionName
          ? { ...sec, items: [...sec.items, value] }
          : sec
      )
    );
    setInputValues((prev) => ({ ...prev, [sectionName]: "" }));
  };

  const handleRemoveItem = (sectionName: string, index: number) => {
    setSkillsData((prev) =>
      prev.map((sec) =>
        sec.name === sectionName
          ? { ...sec, items: sec.items.filter((_, i) => i !== index) }
          : sec
      )
    );
  };

  const handleInputChange = (sectionName: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [sectionName]: value }));
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
      body.append("data", JSON.stringify(skillsData));

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("✅ Skills saved successfully!");
        navigate("/student/dashboard/certifications");
      } else {
        alert(result.message || "❌ Failed to save skills");
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
            setSkillsData(result.data);
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
          Skills & Competencies
        </h2>

        {skillsData.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {section.name}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                  <button
                    onClick={() => handleRemoveItem(section.name, i)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValues[section.name] || ""}
                onChange={(e) =>
                  handleInputChange(section.name, e.target.value)
                }
                placeholder={`Add ${section.name}`}
                className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => handleAddItem(section.name)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate("/student/dashboard/experience")}
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

export default SkillsSection;
