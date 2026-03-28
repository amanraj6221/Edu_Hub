// 📂 src/pages/admin/dashboard/AdminPortfolioSummary.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
let socket: Socket;

interface SectionData {
  data?: any;
  files?: Record<string, string>;
}

interface Portfolio {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    course: string;
    email?: string;
    phone?: string;
  };
  status: "Pending" | "Approved" | "Rejected" | "Ready" | "ForwardedToAdmin";
  submittedAt: string;
  remark?: string;
  studentSections?: Record<string, SectionData>;
  pdfUrl?: string;
}

const statusMap: Record<string, { text: string; color: string }> = {
  Pending: { text: "Pending with Faculty", color: "text-yellow-600" },
  Approved: { text: "Approved by Faculty", color: "text-green-600" },
  Rejected: { text: "Rejected by Faculty", color: "text-red-600" },
  ForwardedToAdmin: { text: "Pending with Admin", color: "text-blue-600" },
  Ready: { text: "Ready / Approved by Admin", color: "text-green-700" },
};

const displayNameMap: Record<string, string> = {
  profile: "Personal Profile",
  education: "Education",
  experience: "Work Experience",
  skills: "Skills",
  certifications: "Certifications",
  training: "Training & Workshops",
  projects: "Projects",
  volunteer: "Volunteer Work",
  socialLinks: "Social Links",
  additionalInfo: "Additional Information",
};

// Helper: Convert object to readable text
const formatSectionData = (data: any, maxLength = 120) => {
  if (!data) return "";
  let str = "";
  if (typeof data === "string" || typeof data === "number") {
    str = String(data);
  } else if (Array.isArray(data)) {
    str = data.map((d) => JSON.stringify(d)).join(", ");
  } else if (typeof data === "object") {
    str = Object.entries(data)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }
  if (str.length > maxLength) str = str.slice(0, maxLength) + "...";
  return str;
};

const AdminPortfolioSummary: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const navigate = useNavigate();

  // Fetch all portfolios
  const fetchPortfolios = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/all`);
      const data = await res.json();
      if (res.ok && data.success) setPortfolios(data.portfolios || []);
      else setPortfolios([]);
    } catch (err) {
      console.error("Failed to fetch portfolios:", err);
      setPortfolios([]);
    }
  };

  // Initialize socket for live updates
  useEffect(() => {
    fetchPortfolios();

    socket = io(API_BASE);
    socket.on("portfolio_update", (update: any) => {
      if (!update?.portfolioId) return;

      setPortfolios((prev) => {
        const idx = prev.findIndex((p) => p._id === update.portfolioId);

        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            status: update.status,
            remark: update.remark || "",
            studentSections: update.studentSections || {},
            pdfUrl: update.pdfUrl || "",
          };
          return updated;
        }

        return [
          {
            _id: update.portfolioId,
            studentId: update.studentId,
            status: update.status,
            remark: update.remark || "",
            studentSections: update.studentSections || {},
            pdfUrl: update.pdfUrl || "",
            submittedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Render
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Portfolio Summary</h2>

      {portfolios.length === 0 ? (
        <p className="text-gray-600">No portfolios available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((p) => {
            const statusInfo = statusMap[p.status] || {
              text: p.status,
              color: "text-gray-600",
            };

            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold">{p.studentId.name}</h3>
                <p className="text-gray-600 mt-1">
                  Course: {p.studentId.course || "N/A"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Submitted: {new Date(p.submittedAt).toLocaleString()}
                </p>
                <p className={`mt-2 font-medium ${statusInfo.color}`}>
                  Status: {statusInfo.text}
                  {p.remark ? ` - Remark: ${p.remark}` : ""}
                </p>

                {/* Quick preview of first 2 sections as text */}
                {p.studentSections &&
                  Object.entries(p.studentSections)
                    .slice(0, 2)
                    .map(([key, section]) => (
                      <div key={key} className="mt-2">
                        {section.data && (
                          <p className="text-gray-700 text-sm">
                            <b>{displayNameMap[key]}:</b>{" "}
                            {formatSectionData(section.data)}
                          </p>
                        )}
                        {section.files &&
                          Object.keys(section.files).length > 0 && (
                            <p className="text-blue-600 text-sm underline">
                              {Object.keys(section.files).join(", ")}
                            </p>
                          )}
                      </div>
                    ))}

                {/* Navigate with full portfolio object */}
                <Button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() =>
                    navigate(`/admin/dashboard/portfolio/${p._id}`, {
                      state: { portfolio: p },
                    })
                  }
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioSummary;
