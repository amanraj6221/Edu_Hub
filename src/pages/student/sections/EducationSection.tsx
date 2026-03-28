import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface EducationEntry {
  level: string;
  institute: string;
  boardOrUniversity: string;
  year: string;
  percentage: string;
  marksheet?: File | null;
}

const EducationSection: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Student ID from localStorage
  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "education";

  const [entries, setEntries] = useState<EducationEntry[]>([
    {
      level: "",
      institute: "",
      boardOrUniversity: "",
      year: "",
      percentage: "",
      marksheet: null,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch draft on load
  useEffect(() => {
    const fetchDraft = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/api/student/section/${sectionId}/${studentId}`
        );
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data?.length) {
            setEntries(
              result.data.map((e: any) => ({ ...e, marksheet: null }))
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

  const handleChange = (
    index: number,
    field: keyof EducationEntry,
    value: any
  ) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...entries];
    updated[index].marksheet = file;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        level: "",
        institute: "",
        boardOrUniversity: "",
        year: "",
        percentage: "",
        marksheet: null,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // ✅ Save draft or final
  const handleSaveNext = async () => {
    if (!studentId) {
      alert("❌ Student ID not found. Please login again.");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", sectionId);
      formData.append(
        "data",
        JSON.stringify(entries.map(({ marksheet, ...rest }) => rest))
      );

      entries.forEach((e, idx) => {
        if (e.marksheet) formData.append(`marksheet_${idx}`, e.marksheet);
      });

      const res = await fetch(
        `http://localhost:5000/api/student/section/save`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Education saved successfully!");
        navigate("/student/dashboard/experience"); // Next section
      } else {
        alert(result.message || "❌ Failed to save Education");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Server error - Please try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Education Details
        </h2>

        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Level (SSC/HSC/UG/PG)"
                value={entry.level}
                onChange={(e) => handleChange(idx, "level", e.target.value)}
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Institute"
                value={entry.institute}
                onChange={(e) => handleChange(idx, "institute", e.target.value)}
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Board/University"
                value={entry.boardOrUniversity}
                onChange={(e) =>
                  handleChange(idx, "boardOrUniversity", e.target.value)
                }
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Year"
                value={entry.year}
                onChange={(e) => handleChange(idx, "year", e.target.value)}
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Percentage/CGPA"
                value={entry.percentage}
                onChange={(e) =>
                  handleChange(idx, "percentage", e.target.value)
                }
                className="border p-2 rounded-lg"
              />
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) =>
                  handleFileChange(idx, e.target.files?.[0] || null)
                }
                className="border p-2 rounded-lg"
              />
            </div>
            {entries.length > 1 && (
              <button
                onClick={() => removeEntry(idx)}
                className="mt-2 text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addEntry}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl"
        >
          + Add Education
        </button>

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/profile")}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            ← Back
          </button>
          <button
            onClick={handleSaveNext}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? "Saving..." : "Save & Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
