// C:\Users\Aman Raj\EducationHub\EducationHub\src\layouts\StudentLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Home,
  User,
  BookOpen,
  CheckCircle,
  FileText,
  Settings,
  LogOut,
  BarChart3,
  Award,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    navigate("/student/login");
  };

  let studentName = "Student";
  let studentEmail = "student@example.com";
  try {
    const user = JSON.parse(localStorage.getItem("studentInfo") || "{}");
    studentName = user?.name || "Student";
    studentEmail = user?.email || "student@example.com";
  } catch (err) {
    studentName = "Student";
    studentEmail = "student@example.com";
  }

  const navigationItems = [
    {
      name: "Dashboard Overview",
      icon: <Home className="h-4 w-4" />,
      path: "/student/dashboard/home",
    },
    {
      name: "My Courses",
      icon: <BookOpen className="h-4 w-4" />,
      path: "/student/dashboard/courses",
    },
    {
      name: "Progress Tracking",
      icon: <BarChart3 className="h-4 w-4" />,
      path: "/student/dashboard/progress",
    },
    {
      name: "Certificates",
      icon: <Award className="h-4 w-4" />,
      path: "/student/dashboard/certificates",
    },
    {
      name: "Portfolio",
      icon: <FileText className="h-4 w-4" />,
      path: "/student/dashboard/portfolio",
    },
    {
      name: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/student/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Enhanced Sidebar */}
      <aside className="w-72 flex-shrink-0">
        <div className="bg-sidebar min-h-screen p-6 flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sidebar-primary to-transparent"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div className="w-20 h-20 bg-sidebar-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="h-10 w-10 text-sidebar-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl text-sidebar-foreground mb-1">
              {studentName}
            </h3>
            <p className="text-sm text-sidebar-foreground/70">{studentEmail}</p>
            <div className="mt-3 px-3 py-1 bg-sidebar-primary/20 rounded-full text-xs text-sidebar-primary font-medium">
              Student Portal
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1 relative z-10">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`sidebar-nav-item w-full text-left ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span className="text-sidebar-foreground/70">{item.icon}</span>
                <span className="text-sidebar-foreground">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-sidebar-border mt-6 relative z-10">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
