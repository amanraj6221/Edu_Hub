import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Calendar,
  Building,
  Award,
  Star,
  Search,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

// Types
interface College {
  id: number;
  name: string;
  placementRate: number;
  naacScore: number;
  activityCount: number;
  accreditationStatus: "A+" | "A" | "B+" | "B" | "C";
  studentParticipation: number;
  certifications: number;
}

interface Report {
  id: number;
  studentName: string;
  department: string;
  activityType: "Workshop" | "Internship" | "Certificate";
  status: "Pending" | "Approved" | "Rejected";
  verifiedBy: string;
  date: string;
}

interface KPI {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
}

// Dummy Data
const collegesData: College[] = [
  {
    id: 1,
    name: "IIT Bombay",
    placementRate: 92,
    naacScore: 3.8,
    activityCount: 156,
    accreditationStatus: "A+",
    studentParticipation: 88,
    certifications: 245,
  },
  {
    id: 2,
    name: "IIT Delhi",
    placementRate: 89,
    naacScore: 3.7,
    activityCount: 142,
    accreditationStatus: "A+",
    studentParticipation: 85,
    certifications: 231,
  },
  {
    id: 3,
    name: "BITS Pilani",
    placementRate: 87,
    naacScore: 3.6,
    activityCount: 138,
    accreditationStatus: "A",
    studentParticipation: 82,
    certifications: 218,
  },
  {
    id: 4,
    name: "NIT Trichy",
    placementRate: 84,
    naacScore: 3.5,
    activityCount: 127,
    accreditationStatus: "A",
    studentParticipation: 78,
    certifications: 195,
  },
  {
    id: 5,
    name: "VIT Vellore",
    placementRate: 82,
    naacScore: 3.4,
    activityCount: 121,
    accreditationStatus: "A",
    studentParticipation: 75,
    certifications: 182,
  },
];

const reportsData: Report[] = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    department: "Computer Science",
    activityType: "Internship",
    status: "Approved",
    verifiedBy: "Dr. Gupta",
    date: "2024-01-15",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    department: "Mechanical",
    activityType: "Workshop",
    status: "Pending",
    verifiedBy: "-",
    date: "2024-01-14",
  },
  {
    id: 3,
    studentName: "Rahul Kumar",
    department: "Electronics",
    activityType: "Certificate",
    status: "Rejected",
    verifiedBy: "Dr. Singh",
    date: "2024-01-13",
  },
  {
    id: 4,
    studentName: "Sneha Reddy",
    department: "Civil",
    activityType: "Internship",
    status: "Approved",
    verifiedBy: "Dr. Iyer",
    date: "2024-01-12",
  },
  {
    id: 5,
    studentName: "Karan Malhotra",
    department: "Computer Science",
    activityType: "Workshop",
    status: "Pending",
    verifiedBy: "-",
    date: "2024-01-11",
  },
];

const departmentActivityData = [
  { name: "Computer Science", activities: 45 },
  { name: "Mechanical", activities: 32 },
  { name: "Electronics", activities: 28 },
  { name: "Civil", activities: 24 },
  { name: "Chemical", activities: 18 },
];

const approvalStatusData = [
  { name: "Approved", value: 65, color: "#10b981" },
  { name: "Pending", value: 25, color: "#f59e0b" },
  { name: "Rejected", value: 10, color: "#ef4444" },
];

const placementTrendData = [
  { year: "2020", placementRate: 75, activities: 89 },
  { year: "2021", placementRate: 78, activities: 94 },
  { year: "2022", placementRate: 82, activities: 112 },
  { year: "2023", placementRate: 85, activities: 128 },
  { year: "2024", placementRate: 88, activities: 145 },
];

const NaacAicteReports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedCycle, setSelectedCycle] = useState("2022-2024");
  const [sortBy, setSortBy] = useState<
    "placement" | "activities" | "accreditation"
  >("placement");
  const [activeTab, setActiveTab] = useState<"naac" | "aicte" | "audit">(
    "naac"
  );

  // KPI Cards Data
  const kpiData: KPI[] = [
    {
      title: "Total Student Records",
      value: "12,847",
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Approved Activities",
      value: "8,352",
      change: "+8%",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Accreditation Compliance",
      value: "94%",
      change: "+5%",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Placement Success Rate",
      value: "86%",
      change: "+3%",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const getRankingBadge = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  const sortedColleges = [...collegesData].sort((a, b) => {
    switch (sortBy) {
      case "placement":
        return b.placementRate - a.placementRate;
      case "activities":
        return b.activityCount - a.activityCount;
      case "accreditation":
        return b.naacScore - a.naacScore;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              NAAC & AICTE Reports & Rankings
            </h1>
            <p className="text-gray-600">
              Comprehensive dashboard for accreditation tracking and
              institutional rankings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Global Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electronics">Electronics</option>
                <option value="Civil">Civil</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
              >
                <option value="2022-2024">2022-2024 Cycle</option>
                <option value="2020-2022">2020-2022 Cycle</option>
                <option value="2018-2020">2018-2020 Cycle</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {kpi.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {kpi.change} from last period
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bar Chart - Activities per Department */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activities per Department
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="activities"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Placement Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Year-wise Placement Rate & Activities Growth
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={placementTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="placementRate"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="activities"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Pie Chart - Approval Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Approval Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={approvalStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {approvalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {approvalStatusData.map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { id: "naac", label: "NAAC Criteria" },
                  { id: "aicte", label: "AICTE Metrics" },
                  { id: "audit", label: "Audit Logs" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4">
              {activeTab === "naac" && (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((criterion) => (
                    <div
                      key={criterion}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">Criterion {criterion}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${70 + criterion * 4}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {70 + criterion * 4}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "aicte" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        1,250
                      </div>
                      <div className="text-sm text-blue-600">Total Intake</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        89%
                      </div>
                      <div className="text-sm text-green-600">
                        Pass Percentage
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Faculty Publications</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Projects</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Research Grants</span>
                      <span className="font-medium">₹2.4Cr</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "audit" && (
                <div className="space-y-3">
                  {[
                    {
                      action: "Approved",
                      by: "Dr. Sharma",
                      time: "2 hours ago",
                      record: "INT-2024-001",
                    },
                    {
                      action: "Rejected",
                      by: "Dr. Kumar",
                      time: "4 hours ago",
                      record: "WS-2024-015",
                    },
                    {
                      action: "Approved",
                      by: "Dr. Patel",
                      time: "1 day ago",
                      record: "CERT-2024-089",
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span
                            className={`font-medium ${
                              log.action === "Approved"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className="text-gray-600 ml-2">
                            by {log.by}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {log.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Record: {log.record}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* College Rankings */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
            College Rankings
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              {[
                { key: "placement", label: "Placement" },
                { key: "activities", label: "Activities" },
                { key: "accreditation", label: "Accreditation" },
              ].map((option) => (
                <button
                  key={option.key}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sortBy === option.key
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSortBy(option.key as any)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedColleges.map((college, index) => (
            <div
              key={college.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-8">
                  {getRankingBadge(index)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {college.name}
                  </h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      Placement: <strong>{college.placementRate}%</strong>
                    </span>
                    <span className="text-sm text-gray-600">
                      NAAC: <strong>{college.naacScore}</strong>
                    </span>
                    <span className="text-sm text-gray-600">
                      Activities: <strong>{college.activityCount}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Accreditation
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      college.accreditationStatus === "A+"
                        ? "text-green-600"
                        : college.accreditationStatus === "A"
                          ? "text-blue-600"
                          : college.accreditationStatus === "B+"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                  >
                    {college.accreditationStatus}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
            Detailed Activity Reports
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Student Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Department
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Activity Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Verified By
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{report.studentName}</td>
                  <td className="py-3 px-4">{report.department}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.activityType === "Internship"
                          ? "bg-blue-100 text-blue-800"
                          : report.activityType === "Workshop"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {report.activityType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : report.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{report.verifiedBy}</td>
                  <td className="py-3 px-4">{report.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      {report.status === "Pending" && (
                        <>
                          <button
                            className="p-1 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NaacAicteReports;
