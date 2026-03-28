// C:\Users\Aman Raj\EducationHub\EducationHub\src\pages\admin\AdminDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  FileText,
  CheckCircle,
  BookOpen,
  Clock,
  Settings,
} from "lucide-react";

// Dummy stats
const stats = [
  {
    title: "Total Users",
    value: 20,
    change: "+15%",
    icon: <User className="h-6 w-6 text-gray-500" />,
    description: "Registered users",
  },
  {
    title: "Departments",
    value: 12,
    change: "+2%",
    icon: <Users className="h-6 w-6 text-gray-500" />,
    description: "Active departments",
  },
  {
    title: "Reports Generated",
    value: 6,
    change: "+10%",
    icon: <FileText className="h-6 w-6 text-gray-500" />,
    description: "This month",
  },
  {
    title: "Pending Approvals",
    value: 8,
    change: "-5%",
    icon: <CheckCircle className="h-6 w-6 text-gray-500" />,
    description: "Awaiting action",
  },
];

// Dummy recent activities
const activities = [
  { id: 1, type: "User Registered", user: "Amit Kumar", time: "2 hours ago" },
  {
    id: 2,
    type: "Department Added",
    user: "Computer Science",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "Report Generated",
    user: "Quarterly Report",
    time: "1 day ago",
  },
  { id: 4, type: "User Approved", user: "Priya Patel", time: "2 days ago" },
];

// Dummy quick actions
const quickActions = [
  { name: "Add User", icon: <User className="h-5 w-5 mr-2" />, route: "" },
  {
    name: "Manage Departments",
    icon: <Users className="h-5 w-5 mr-2" />,
    route: "/admin/dashboard/departments",
  },
  {
    name: "Generate Report",
    icon: <FileText className="h-5 w-5 mr-2" />,
    route: "",
  },
  {
    name: "Settings",
    icon: <Settings className="h-5 w-5 mr-2" />,
    route: "/admin/dashboard/settings",
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  let adminName = "Admin";
  try {
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    adminName = user?.username || "Admin";
  } catch (err) {
    console.warn("Admin user data missing or corrupted", err);
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
            Welcome, {adminName}
          </h2>
          <p className="text-gray-600">
            Manage users, departments, approvals, and generate reports.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
    </div>
  );
};

export default AdminDashboard;
