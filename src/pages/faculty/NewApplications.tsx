//C:\Users\Aman Raj\EducationHub\EducationHub\src\pages\faculty\NewApplications.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SectionData {
  data: any;
  files: Record<string, string>;
}

interface PortfolioApplication {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    course: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  remark?: string;
  sections?: Record<string, SectionData>; // final merged
  studentSections?: Record<string, SectionData>; // drafts
}

const API_BASE = "http://localhost:5000";

const displayNameMap: Record<string, string> = {
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

const NewApplications: React.FC = () => {
  const [applications, setApplications] = useState<PortfolioApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/all`);
      const result = await res.json();
      if (res.ok && result.success) setApplications(result.portfolios || []);
      else setApplications([]);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const s = io(API_BASE);
    setSocket(s);
    s.on("portfolio_update", () => fetchApplications());
    return () => s.disconnect();
  }, []);

  if (loading)
    return <div className="p-6 text-center">Loading applications...</div>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-gray-800">New Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">No new applications.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">{app.studentId.name}</h3>
              <p className="text-gray-600 mt-1">
                Course: {app.studentId.course || "N/A"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Submitted: {new Date(app.submittedAt).toLocaleString()}
              </p>
              <p
                className={`mt-2 font-medium ${
                  app.status === "Approved"
                    ? "text-green-600"
                    : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                Status: {app.status}{" "}
                {app.remark ? `- Remark: ${app.remark}` : ""}
              </p>

              {app.sections && Object.keys(app.sections).length > 0 && (
                <div className="mt-2 text-gray-700 text-sm">
                  Final Sections:{" "}
                  {Object.keys(app.sections)
                    .map((key) => displayNameMap[key] || key)
                    .join(", ")}
                </div>
              )}

              {app.studentSections &&
                Object.keys(app.studentSections).length > 0 && (
                  <div className="mt-2 text-gray-700 text-sm">
                    Draft Sections:{" "}
                    {Object.keys(app.studentSections)
                      .map((key) => displayNameMap[key] || key)
                      .join(", ")}
                  </div>
                )}

              {/*  Updated navigation to include /dashboard */}
              <Button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() =>
                  navigate(`/faculty/dashboard/application/${app._id}`)
                }
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewApplications;
