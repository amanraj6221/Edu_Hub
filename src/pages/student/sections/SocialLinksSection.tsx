// SocialLinksSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
  codingProfiles: { platform: string; url: string }[];
}

const SocialLinksSection: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "socialLinks";

  const [formData, setFormData] = useState<SocialLinks>({
    linkedin: "",
    github: "",
    portfolio: "",
    twitter: "",
    codingProfiles: [{ platform: "", url: "" }],
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCodingProfileChange = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updatedProfiles = [...formData.codingProfiles];
    updatedProfiles[index][field] = value;
    setFormData({ ...formData, codingProfiles: updatedProfiles });
  };

  const addCodingProfile = () => {
    setFormData({
      ...formData,
      codingProfiles: [...formData.codingProfiles, { platform: "", url: "" }],
    });
  };

  const removeCodingProfile = (index: number) => {
    const updatedProfiles = formData.codingProfiles.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, codingProfiles: updatedProfiles });
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
      body.append("data", JSON.stringify(formData));

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Social links saved successfully!");
        navigate("/student/dashboard/volunteer");
      } else {
        alert(result.message || "❌ Failed to save social links");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Social Links & Profiles
        </h2>
        <p className="text-gray-600 mb-6">
          Add your social profiles and coding platforms. You can add multiple
          coding profiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "linkedin", placeholder: "LinkedIn Profile URL" },
            { name: "github", placeholder: "GitHub Profile URL" },
            { name: "portfolio", placeholder: "Portfolio Website URL" },
            { name: "twitter", placeholder: "Twitter Profile URL" },
          ].map((field, idx) => (
            <input
              key={idx}
              type="url"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof SocialLinks] as string}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          ))}
        </div>

        {/* Dynamic Coding Profiles */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Coding Profiles
          </h3>
          {formData.codingProfiles.map((profile, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-3 mb-3 items-center"
            >
              <input
                type="text"
                placeholder="Platform (LeetCode, HackerRank, etc.)"
                value={profile.platform}
                onChange={(e) =>
                  handleCodingProfileChange(idx, "platform", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-xl p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <input
                type="url"
                placeholder="Profile URL"
                value={profile.url}
                onChange={(e) =>
                  handleCodingProfileChange(idx, "url", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-xl p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {formData.codingProfiles.length > 1 && (
                <button
                  onClick={() => removeCodingProfile(idx)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addCodingProfile}
            className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            + Add Another Profile
          </button>
        </div>

        <div className="mt-10 flex justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate("/student/dashboard/projects")}
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

export default SocialLinksSection;
