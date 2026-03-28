// C:\Users\Aman Raj\EducationHub\EducationHub\src\pages\student\sections\FinalSubmitSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FinalSubmitSection: React.FC = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;

  const [submitting, setSubmitting] = useState(false);
  const [sectionsStatus, setSectionsStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [sectionsData, setSectionsData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  // ✅ Fetch all sections status + data
  useEffect(() => {
    const fetchSections = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      const sections = [
        "profile",
        "education",
        "experience",
        "skills",
        "certifications",
        "training",
        "projects",
        "socialLinks",
        "volunteer",
        "additionalInfo",
      ];

      const status: { [key: string]: boolean } = {};
      const data: { [key: string]: any } = {};

      try {
        await Promise.all(
          sections.map(async (section) => {
            try {
              const res = await fetch(
                `${API_BASE}/api/student/section/${section}/${studentId}`
              );
              if (res.ok) {
                const result = await res.json();
                status[section] = result.success && result.data !== null;
                data[section] = {
                  data: result.data || {},
                  files: result.files || {},
                };
              } else {
                status[section] = false;
                data[section] = { data: {}, files: {} };
              }
            } catch {
              status[section] = false;
              data[section] = { data: {}, files: {} };
            }
          })
        );
        setSectionsStatus(status);
        setSectionsData(data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [studentId]);

  // ------------------ FINAL SUBMIT ------------------
  const handleFinalSubmit = async () => {
    if (!studentId)
      return alert("❌ Student ID not found. Please login again.");

    const incompleteSections = Object.entries(sectionsStatus)
      .filter(([_, completed]) => !completed)
      .map(([section]) => section);

    if (incompleteSections.length > 0) {
      return alert(
        `❌ Complete the following sections first: ${incompleteSections.join(", ")}`
      );
    }

    if (
      !window.confirm(
        "Are you sure you want to submit? Once submitted, you cannot make changes."
      )
    )
      return;

    try {
      setSubmitting(true);

      // 1️⃣ Submit all sections + student data
      const res = await fetch(`${API_BASE}/api/student/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          sections: sectionsData, // send all sections
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Application submitted successfully!");

        // ❌ PDF generation removed
        // Redirect to PortfolioStatus page instead of e-Portfolio
        navigate("/student/dashboard/portfolio-status");
      } else {
        alert(result.message || "❌ Failed to submit application");
      }
    } catch (err) {
      console.error("Final submit error:", err);
      alert("❌ Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSectionDisplayName = (section: string) => {
    const names: { [key: string]: string } = {
      profile: "Personal Profile",
      education: "Education Details",
      experience: "Work Experience",
      skills: "Skills & Competencies",
      certifications: "Certifications",
      training: "Training & Workshops",
      projects: "Projects",
      socialLinks: "Social Links",
      volunteer: "Volunteer",
      additionalInfo: "Additional Information",
    };
    return names[section] || section;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading sections status...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Final Submission
        </h2>

        {/* Sections Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Application Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sectionsStatus).map(([section, completed]) => (
              <div key={section} className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${
                    completed ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span className={completed ? "text-green-700" : "text-red-700"}>
                  {getSectionDisplayName(section)}:{" "}
                  {completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Important Notes:
          </h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Review all sections before final submission</li>
            <li>Once submitted, changes are not allowed</li>
            <li>Ensure all uploaded documents are clear</li>
            <li>Contact support for post-submission changes</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/additional-info")}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          <div className="space-x-4">
            <button
              onClick={() => navigate("/student/dashboard/profile")}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Review Application
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={
                submitting ||
                Object.values(sectionsStatus).some((status) => !status)
              }
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:bg-green-400"
            >
              {submitting ? "Submitting..." : "Final Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSubmitSection;
