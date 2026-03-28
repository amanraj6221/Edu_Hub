// 📂 src/layouts/AdminLayout.tsx

import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Award,
  Folder,
  Home,
  Users,
  LogOut,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/", { replace: true });
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    {
      label: "Portfolio Generated",
      icon: FileText,
      path: "/admin/dashboard/portfolio-generated/123", // requires :id → sample
    },
    {
      label: "Portfolio Summary",
      icon: BookOpen,
      path: "/admin/dashboard/portfolio-summary",
    },
    {
      label: "NAAC & AICTE Reports",
      icon: Folder,
      path: "/admin/dashboard/naac-aicte",
    },
    {
      label: "Audit Management",
      icon: Award,
      path: "/admin/dashboard/audit-management",
    },
    {
      label: "Manage Users",
      icon: Users,
      path: "/admin/dashboard/users",
    },
    {
      label: "Manage Departments",
      icon: Award,
      path: "/admin/dashboard/departments",
    },
    {
      label: "Settings",
      icon: BookOpen,
      path: "/admin/dashboard/settings",
    },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Card className="p-6 h-full rounded-none flex flex-col justify-between">
          <div>
            {/* Sidebar Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Admin Panel</h3>
              <p className="text-sm text-gray-600">Manage Portal</p>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={`${item.path}-${index}`}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full flex items-center justify-start gap-2 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
