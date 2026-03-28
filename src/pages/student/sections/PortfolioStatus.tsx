// 📂 src/pages/student/sections/PortfolioStatus.tsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface PortfolioStatusType {
  status: "Not Submitted" | "Pending" | "Approved" | "Rejected" | "Ready";
  remark?: string;
  pdfUrl?: string | null;
  portfolioId?: string | null;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PortfolioStatus: React.FC = () => {
  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;

  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatusType>({
    status: "Not Submitted",
  });
  const [loading, setLoading] = useState(true);

  // ------------------- Fetch current portfolio status -------------------
  const fetchStatus = async () => {
    if (!studentId) return;
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/status/${studentId}`);
      const result = await res.json();
      if (res.ok || res.status === 200) {
        setPortfolioStatus({
          status: result.status || "Not Submitted",
          remark: result.remark || "",
          pdfUrl: result.pdfUrl || null,
          portfolioId: result.portfolioId || null,
        });
      } else {
        setPortfolioStatus({ status: "Not Submitted" });
      }
    } catch (err) {
      console.error("Fetch portfolio status error:", err);
      setPortfolioStatus({ status: "Not Submitted" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Socket.IO for real-time updates -------------------
  useEffect(() => {
    if (!studentId) return;
    const socket = io(API_BASE, { transports: ["websocket"] });

    socket.on("portfolio_update", (data: any) => {
      if (data.studentId === studentId) {
        setPortfolioStatus({
          status: data.status,
          remark: data.remark || "",
          pdfUrl: data.pdfUrl || null,
          portfolioId: data.portfolioId || null,
        });

        if (data.status === "Ready" || data.status === "Approved") {
          alert("✅ Your portfolio is ready! You can now view/download it.");
        }

        if (data.status === "Rejected" || data.status === "RejectedByAdmin") {
          alert(
            "❌ Your portfolio was rejected. Reason: " + (data.remark || "N/A")
          );
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [studentId]);

  useEffect(() => {
    fetchStatus();
  }, [studentId]);

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-700 font-medium">
        Loading portfolio status...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
      case "Approved":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
      case "RejectedByAdmin":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const isReady =
    portfolioStatus.status === "Ready" || portfolioStatus.status === "Approved";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Portfolio Status
      </h2>
      <p className="text-gray-600 mb-4">
        Here you can view the current status of your portfolio. Updates are
        reflected in real-time.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={`w-4 h-4 rounded-full ${getStatusColor(
            portfolioStatus.status
          )}`}
        ></span>
        <span className="font-medium text-gray-700">
          Status: {portfolioStatus.status}
          {portfolioStatus.remark ? ` - Remark: ${portfolioStatus.remark}` : ""}
        </span>
      </div>

      {/* Status Messages */}
      {(portfolioStatus.status === "Rejected" ||
        portfolioStatus.status === "RejectedByAdmin") && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ Your submission was rejected. Reason:{" "}
          {portfolioStatus.remark || "N/A"}
        </div>
      )}

      {portfolioStatus.status === "Pending" && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          ⏳ Your portfolio is under review by faculty/admin. Please wait.
        </div>
      )}

      {portfolioStatus.status === "Not Submitted" && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
          ⚠️ You have not submitted your portfolio yet.
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        {/* PDF View/Download */}
        <a
          href={
            isReady && portfolioStatus.pdfUrl ? portfolioStatus.pdfUrl : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center py-2 px-4 rounded-lg transition ${
            isReady
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isReady) e.preventDefault();
          }}
        >
          📄 View / Download Portfolio (PDF)
        </a>

        {/* Web View */}
        <a
          href={
            isReady && portfolioStatus.portfolioId
              ? `/student/portfolio/${portfolioStatus.portfolioId}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center py-2 px-4 rounded-lg transition ${
            isReady
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isReady) e.preventDefault();
          }}
        >
          🌐 View Portfolio (Web)
        </a>
      </div>
    </div>
  );
};

export default PortfolioStatus;
