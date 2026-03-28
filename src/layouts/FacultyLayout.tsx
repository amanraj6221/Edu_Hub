import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Home,
  User,
  FileText,
  CheckCircle,
  BookOpen,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FacultyLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // ✅ logout → clear storage + homepage redirect
  const handleLogout = () => {
    localStorage.removeItem("faculty_token");
    localStorage.removeItem("faculty_user");
    navigate("/"); //
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Card className="p-6 h-full rounded-none flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Faculty Member</h3>
              <p className="text-sm text-gray-600">Faculty Portal</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => navigate("/faculty/dashboard/home")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/home")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4 mr-3" />
                Dashboard Overview
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/students")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/students")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User className="h-4 w-4 mr-3" />
                Student Records
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/new-applications")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/new-applications")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4 mr-3" />
                New Applications
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/naac-aicte")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/naac-aicte")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4 mr-3" />
                NAAC/AICTE Reports
              </button>

              <button
                onClick={() =>
                  navigate("/faculty/dashboard/certificate-validation")
                }
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/certificate-validation")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-3" />
                Certificate Validation
              </button>

              <button
                onClick={() =>
                  navigate("/faculty/dashboard/document-verification")
                }
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/document-verification")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4 mr-3" />
                Document Verification
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/portfolio-ready")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/portfolio-ready")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4 mr-3" />
                Portfolio Ready
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/course-management")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/course-management")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BookOpen className="h-4 w-4 mr-3" />
                Course Management
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/attendance")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/attendance")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Clock className="h-4 w-4 mr-3" />
                Attendance Tracking
              </button>

              <button
                onClick={() => navigate("/faculty/dashboard/settings")}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                  isActive("/faculty/dashboard/settings")
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </button>
            </nav>
          </div>

          {/* Sidebar Footer (Logout at bottom) */}
          <div className="pt-6 border-t border-gray-200 mt-6">
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
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default FacultyLayout;
