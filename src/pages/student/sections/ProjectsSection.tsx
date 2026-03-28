// ProjectsSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectsSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;
  const sectionId = "projects";

  const [formData, setFormData] = useState({
    projectTitle: "",
    projectType: "",
    technologiesUsed: "",
    duration: "",
    teamSize: "",
    projectDescription: "",
    githubLink: "",
    liveDemoLink: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    projectDocumentation: null,
    projectScreenshot: null,
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
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

      Object.entries(files).forEach(([key, file]) => {
        if (file) body.append(key, file);
      });

      const res = await fetch(`${API_BASE}/api/student/section/save`, {
        method: "POST",
        body,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Project details saved successfully!");
        navigate("/student/dashboard/social-links");
      } else {
        alert(result.message || "❌ Failed to save project details");
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
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "projectTitle",
              placeholder: "Project Title",
              required: true,
            },
            {
              name: "projectType",
              placeholder: "Project Type (Academic/Personal/Professional)",
              required: true,
            },
            {
              name: "technologiesUsed",
              placeholder: "Technologies Used",
              required: true,
            },
            { name: "duration", placeholder: "Duration (e.g., 3 months)" },
            { name: "teamSize", placeholder: "Team Size", type: "number" },
            { name: "githubLink", placeholder: "GitHub Repository Link" },
            { name: "liveDemoLink", placeholder: "Live Demo Link" },
          ].map((field, idx) => (
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
          ))}
        </div>

        <div className="mt-6">
          <textarea
            name="projectDescription"
            placeholder="Project Description, Features, and Your Role"
            value={formData.projectDescription}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "projectDocumentation",
              label: "Project Documentation/Report",
              accept: ".pdf,.doc,.docx",
            },
            {
              name: "projectScreenshot",
              label: "Project Screenshot",
              accept: "image/*",
            },
          ].map((fileField, idx) => (
            <label key={idx} className="flex flex-col">
              <span className="text-gray-700 mb-2 font-medium">
                {fileField.label}
              </span>
              <input
                type="file"
                name={fileField.name}
                accept={fileField.accept}
                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          ))}
        </div>

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/training")}
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

export default ProjectsSection;
