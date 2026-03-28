// src/pages/admin/AdminApprovalSuccess.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminApprovalSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioId = (location.state as any)?.portfolioId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Admin Approved
        </h1>
        <p className="text-gray-700 mb-6">
          The student's portfolio has been approved successfully.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            if (portfolioId) navigate(`/admin/portfolio/${portfolioId}`);
          }}
        >
          View Student Portfolio
        </Button>
      </div>
    </div>
  );
};

export default AdminApprovalSuccess;
