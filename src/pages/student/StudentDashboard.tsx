// 📂 src/pages/student/StudentDashboard.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  User,
  FileText,
  Award,
  Briefcase,
  Share2,
  Heart,
  Folder,
  GraduationCap,
  Star,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Mail,
  MapPin,
  Crown,
  Home,
  Menu,
  X,
} from "lucide-react";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // User info
  const [studentName, setStudentName] = useState<string>("Student");
  const [studentEmail, setStudentEmail] = useState<string>("email@example.com");
  const [studentLocation, setStudentLocation] = useState<string>("N/A");

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data (replace with API calls)
  const stats = [
    {
      title: "Certifications",
      value: "3+",
      icon: <Award className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Skills",
      value: "20+",
      icon: <Star className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Projects",
      value: "5+",
      icon: <Folder className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Achievements",
      value: "3+",
      icon: <Crown className="h-5 w-5" />,
      color: "bg-green-100 text-green-600",
    },
  ];

  const quickActions = [
    {
      name: "Browse Courses",
      icon: <BookOpen className="h-5 w-5" />,
      route: "/student/courses",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "My Certificates",
      icon: <Award className="h-5 w-5" />,
      route: "/student/certificates",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Progress Report",
      icon: <TrendingUp className="h-5 w-5" />,
      route: "/student/progress",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "My Portfolio",
      icon: <User className="h-5 w-5" />,
      route: "/student/portfolio",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const sections = [
    {
      id: "overview",
      name: "Overview",
      icon: <Home className="h-5 w-5" />,
      route: "/student/dashboard/overview",
    },
    {
      id: "profile",
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      route: "/student/dashboard/profile",
    },
    {
      id: "education",
      name: "Education",
      icon: <GraduationCap className="h-5 w-5" />,
      route: "/student/dashboard/education",
    },
    {
      id: "experience",
      name: "Experience",
      icon: <Briefcase className="h-5 w-5" />,
      route: "/student/dashboard/experience",
    },
    {
      id: "skills",
      name: "Skills",
      icon: <Star className="h-5 w-5" />,
      route: "/student/dashboard/skills",
    },
    {
      id: "certifications",
      name: "Certifications",
      icon: <Award className="h-5 w-5" />,
      route: "/student/dashboard/certifications",
    },
    {
      id: "training",
      name: "Training",
      icon: <Lightbulb className="h-5 w-5" />,
      route: "/student/dashboard/training",
    },
    {
      id: "projects",
      name: "Projects",
      icon: <Folder className="h-5 w-5" />,
      route: "/student/dashboard/projects",
    },
    {
      id: "social",
      name: "Social Links",
      icon: <Share2 className="h-5 w-5" />,
      route: "/student/dashboard/social-links",
    },
    {
      id: "volunteer",
      name: "Volunteer Work",
      icon: <Heart className="h-5 w-5" />,
      route: "/student/dashboard/volunteer",
    },
    {
      id: "additional",
      name: "Additional Info",
      icon: <Folder className="h-5 w-5" />,
      route: "/student/dashboard/additional-info",
    },
    {
      id: "final-submit",
      name: "Final Submit",
      icon: <FileText className="h-5 w-5" />,
      route: "/student/dashboard/final-submit",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // Navigate to default overview
    if (location.pathname === "/student/dashboard") {
      navigate("/student/dashboard/overview", { replace: true });
      setActiveSection("overview");
    } else {
      const currentSection = sections.find((sec) =>
        location.pathname.includes(sec.id)
      );
      if (currentSection) setActiveSection(currentSection.id);
    }

    // Load user info
    const userData = localStorage.getItem("student_user");
    if (userData) {
      const user = JSON.parse(userData);
      setStudentName(user.name || "Student");
      setStudentEmail(user.email || "email@example.com");
      setStudentLocation(user.location || "N/A");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md flex justify-between items-center p-4 z-50">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
          <Sparkles className="h-6 w-6 text-blue-600" /> EduSangrah
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl border-r border-gray-200 z-40 transform lg:translate-x-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 rounded-r-3xl overflow-y-auto`}
      >
        <div className="p-6 flex flex-col gap-6 mt-16 lg:mt-6">
          <nav className="flex flex-col gap-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  onClick={() => {
                    navigate(section.route);
                    setActiveSection(section.id);
                    setSidebarOpen(false); // close sidebar on mobile
                  }}
                >
                  <div
                    className={`p-2 rounded-xl mr-3 ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-5 border-t border-gray-200">
            <div className="flex items-center mb-4 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-4 shadow-md">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {studentName}
                </p>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <Mail className="h-3 w-3 mr-1" /> {studentEmail}
                </div>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <MapPin className="h-3 w-3 mr-1" /> {studentLocation}
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90 rounded-2xl py-3 flex items-center justify-center shadow-md transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:ml-72 mt-16 lg:mt-0">
        {activeSection === "overview" ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mb-6">Welcome back, {studentName}!</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-3">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className={`flex items-center gap-2 p-4 rounded-2xl shadow-md text-white font-medium bg-gradient-to-r ${action.color} hover:shadow-lg hover:scale-105 transition`}
                  onClick={() => navigate(action.route)}
                >
                  {action.icon}
                  {action.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
