// C:\Users\Aman Raj\EducationHub\EducationHub\src\pages\faculty\FacultyDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Settings,
  User,
  FileText,
} from "lucide-react";

interface Activity {
  id: number;
  type: string;
  user: string;
  time: string;
}
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
}

// Dummy stats
const stats = [
  {
    title: "Total Students",
    value: 142,
    change: "+12%",
    description: "Registered in system",
    icon: <User className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Certificates Verified",
    value: 87,
    change: "+8%",
    description: "This month",
    icon: <CheckCircle className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Pending Verifications",
    value: 23,
    change: "-3%",
    description: "Awaiting review",
    icon: <FileText className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Reports Generated",
    value: 47,
    change: "+15%",
    description: "This semester",
    icon: <Clock className="h-6 w-6 text-gray-500" />,
  },
];

// Dummy recent activities
const activities: Activity[] = [
  {
    id: 1,
    type: "Certificate Validated",
    user: "Rahul Sharma • B.Tech CSE",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Document Verified",
    user: "Priya Patel • MBA Finance",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "Report Generated",
    user: "NAAC Report 2024 • Institutional",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "Student Added",
    user: "Amit Kumar • B.Arch",
    time: "2 days ago",
  },
];

// Dummy upcoming events
const events: Event[] = [
  {
    id: 1,
    title: "NAAC Committee Meeting",
    date: "15 Dec 2024 • 10:00 AM",
    location: "Conference Hall",
  },
  {
    id: 2,
    title: "AICTE Documentation Deadline",
    date: "20 Dec 2024 • 5:00 PM",
    location: "Online",
  },
  {
    id: 3,
    title: "Student Verification Drive",
    date: "22 Dec 2024 • 9:30 AM",
    location: "Main Campus",
  },
];

// Replace with actual student ID or dynamically fetch it
const sampleStudentId = "12345";

// Quick actions with Portfolio Ready button updated
const quickActions = [
  {
    name: "Export Data",
    icon: <BookOpen className="h-5 w-5 mr-2" />,
    route: "",
  },
  { name: "Import Data", icon: <Clock className="h-5 w-5 mr-2" />, route: "" },
  {
    name: "Validate Certificate",
    icon: <CheckCircle className="h-5 w-5 mr-2" />,
    route: "/faculty/dashboard/certificate-validation",
  },
  { name: "Add Student", icon: <User className="h-5 w-5 mr-2" />, route: "" },
  {
    name: "Generate Report",
    icon: <FileText className="h-5 w-5 mr-2" />,
    route: "",
  },
  {
    name: "Verify Document",
    icon: <Settings className="h-5 w-5 mr-2" />,
    route: "/faculty/dashboard/document-verification",
  },
  {
    name: "Portfolio Ready",
    icon: <FileText className="h-5 w-5 mr-2" />,
    route: `/faculty/dashboard/portfolio-ready/${sampleStudentId}`,
  }, // updated
];

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();

  let facultyName = "Faculty Member";
  try {
    const user = JSON.parse(localStorage.getItem("faculty_user") || "{}");
    facultyName = user?.username || "Faculty Member";
  } catch (err) {
    console.warn("Faculty user data missing or corrupted", err);
  }

  const handleNavigate = (route: string) => {
    if (route) navigate(route);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome, {facultyName}
          </h2>
          <p className="text-gray-600">
            Manage student records, validate certificates, and generate reports.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.name}
            onClick={() => handleNavigate(action.route)}
            className="flex items-center p-4 rounded-2xl shadow hover:scale-105 transform transition bg-white text-gray-700"
          >
            {action.icon} {action.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex flex-col p-4 rounded-2xl shadow hover:scale-105 transform transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">{stat.icon}</span>
              <span
                className={`text-sm font-semibold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-gray-400 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activities{" "}
          <span className="text-sm text-blue-600 cursor-pointer">View All</span>
        </h2>
        <ul className="space-y-4">
          {activities.map((act) => (
            <li
              key={act.id}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold">{act.type}</p>
                <p className="text-gray-500 text-sm">{act.user}</p>
              </div>
              <span className="text-gray-400 text-xs">{act.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Upcoming Events{" "}
          <span className="text-sm text-blue-600 cursor-pointer">View All</span>
        </h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-semibold">{event.title}</p>
              <p className="text-gray-500 text-sm">
                {event.date} • {event.location}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;
