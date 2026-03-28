// 📂 src/pages/admin/dashboard/AdminPortfolioDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Briefcase,
  Award,
  Code,
  Globe,
  Heart,
  FileText,
  GraduationCap,
  Building,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

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
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  remark?: string;
  studentSections?: Record<string, SectionData>;
  pdfUrl?: string;
}

const displayNameMap: Record<string, string> = {
  profile: "Personal Profile",
  education: "Education Details",
  experience: "Work Experience",
  skills: "Skills & Competencies",
  certifications: "Certifications & Achievements",
  training: "Training & Workshops",
  projects: "Projects",
  volunteer: "Volunteer Work",
  socialLinks: "Social Links",
  additionalInfo: "Additional Information",
};

const sectionIcons: Record<string, React.ReactNode> = {
  profile: <User className="h-5 w-5" />,
  education: <BookOpen className="h-5 w-5" />,
  experience: <Briefcase className="h-5 w-5" />,
  skills: <Code className="h-5 w-5" />,
  certifications: <Award className="h-5 w-5" />,
  training: <FileText className="h-5 w-5" />,
  projects: <Globe className="h-5 w-5" />,
  socialLinks: <Globe className="h-5 w-5" />,
  volunteer: <Heart className="h-5 w-5" />,
  additionalInfo: <FileText className="h-5 w-5" />,
};

const AdminPortfolioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // ----------------------------
  // Fetch Portfolio Details
  // ----------------------------
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPortfolio(data.portfolio);
        setRemark(data.portfolio.remark || "");
        console.log("Portfolio loaded:", data.portfolio);
      } else {
        setPortfolio(null);
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ----------------------------
  // File URL Helper
  // ----------------------------
  const getFileUrl = (filePath: string | undefined) => {
    if (!filePath) return null;

    // If already a full URL, return as is
    if (filePath.startsWith("http")) return filePath;

    // Normalize slashes and strip any leading directories before "uploads/"
    const relativePath = filePath.replace(/^.*uploads[\\/]/, "uploads/");
    return `${API_BASE}/${relativePath.replace(/\\/g, "/")}`;
  };

  // ----------------------------
  // Profile Photo Access
  // ----------------------------
  const getProfilePhotoUrl = () => {
    const files = portfolio?.studentSections?.profile?.files;
    if (!files) return null;

    // Prioritize 'photo' key
    if (files.photo) return getFileUrl(files.photo);

    // Fallback: first image in files
    for (const path of Object.values(files)) {
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(path)) return getFileUrl(path);
    }

    return null;
  };

  // ----------------------------
  // PDF URL Access
  // ----------------------------
  const getPdfUrl = () => {
    if (!portfolio?.pdfUrl) return null;
    return getFileUrl(portfolio.pdfUrl);
  };

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ----------------------------
  // File Preview Function
  // ----------------------------
  const renderFilePreview = (filePath: string, fileKey: string) => {
    if (!filePath) return null;

    const fileUrl = getFileUrl(filePath);
    const fileExtension = filePath.split(".").pop()?.toLowerCase();

    // Image files
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")) {
      return (
        <div className="flex flex-col items-center">
          <img
            src={fileUrl}
            alt={fileKey}
            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200 mb-2 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            View Image
          </a>
        </div>
      );
    }

    // PDF files
    if (fileExtension === "pdf") {
      return (
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-red-50 rounded-lg border-2 border-red-200 flex flex-col items-center justify-center mb-2">
            <FileText className="w-12 h-12 text-red-500 mb-2" />
            <span className="text-xs text-red-600 font-medium">
              PDF Document
            </span>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            View PDF
          </a>
        </div>
      );
    }

    // Default file type
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-50 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center mb-2">
          <FileText className="w-12 h-12 text-gray-500 mb-2" />
          <span className="text-xs text-gray-600 font-medium">Document</span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    );
  };

  // ----------------------------
  // Data Display Functions
  // ----------------------------
  const renderDataAsText = (
    data: any,
    sectionKey?: string
  ): React.ReactNode => {
    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-200">
          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No data provided</p>
        </div>
      );
    }

    // Special formatting for different sections
    switch (sectionKey) {
      case "education":
        return renderEducationData(data);
      case "experience":
        return renderExperienceData(data);
      case "skills":
        return renderSkillsData(data);
      case "projects":
        return renderProjectsData(data);
      default:
        return renderDefaultData(data);
    }
  };

  const renderEducationData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div
              key={index}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-lg">
                  {edu.degree || edu.course || "Education"}
                </h4>
                {edu.year && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {edu.year}
                  </Badge>
                )}
              </div>
              <p className="text-slate-700 font-medium mb-1">
                {edu.institution || edu.school}
              </p>
              {edu.boardOrUniversity && (
                <p className="text-slate-600 text-sm mb-1">
                  {edu.boardOrUniversity}
                </p>
              )}
              {edu.grade && (
                <p className="text-slate-600">
                  <span className="font-medium">Grade:</span> {edu.grade}
                </p>
              )}
              {edu.percentage && (
                <p className="text-slate-600">
                  <span className="font-medium">Percentage:</span>{" "}
                  {edu.percentage}%
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }
    return renderDefaultData(data);
  };

  const renderExperienceData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <div
              key={index}
              className="bg-green-50 p-4 rounded-lg border border-green-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-lg">
                  {exp.position || exp.role}
                </h4>
                {exp.period && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    {exp.period}
                  </Badge>
                )}
              </div>
              <p className="text-slate-700 font-medium mb-2">
                {exp.company || exp.organization}
              </p>
              {exp.duration && (
                <p className="text-slate-600 text-sm mb-2">
                  <span className="font-medium">Duration:</span> {exp.duration}
                </p>
              )}
              {exp.description && (
                <p className="text-slate-600 mb-3">{exp.description}</p>
              )}
              {exp.responsibilities && Array.isArray(exp.responsibilities) && (
                <div>
                  <p className="font-medium text-slate-700 mb-2">
                    Key Responsibilities:
                  </p>
                  <ul className="list-disc ml-5 space-y-1 text-slate-600">
                    {exp.responsibilities.map((resp: string, i: number) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return renderDefaultData(data);
  };

  const renderSkillsData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              {typeof skill === "object" ? skill.name || skill.skill : skill}
            </Badge>
          ))}
        </div>
      );
    }
    return renderDefaultData(data);
  };

  const renderProjectsData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div className="grid gap-4">
          {data.map((project, index) => (
            <div
              key={index}
              className="bg-orange-50 p-4 rounded-lg border border-orange-200"
            >
              <h4 className="font-semibold text-slate-800 text-lg mb-2">
                {project.title || project.name}
              </h4>
              {project.technologies && Array.isArray(project.technologies) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-white text-orange-600"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              {project.description && (
                <p className="text-slate-600 mb-3">{project.description}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Project
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      );
    }
    return renderDefaultData(data);
  };

  const renderDefaultData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3">
          {data.map((item, i) =>
            typeof item === "object" ? (
              <div
                key={i}
                className="bg-white p-4 rounded-lg border border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <span className="text-sm font-medium text-slate-600 capitalize">
                        {k.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <p className="text-slate-800">
                        {String(v || "Not specified")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-slate-700">{String(item)}</span>
              </div>
            )
          )}
        </div>
      );
    }
    if (typeof data === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="space-y-1">
              <span className="text-sm font-medium text-slate-600 capitalize">
                {k.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">
                {String(v || "Not specified")}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return (
      <p className="text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200">
        {String(data)}
      </p>
    );
  };

  // ----------------------------
  // Portfolio Actions
  // ----------------------------
  const approvePortfolio = async () => {
    if (!portfolio) return;

    setIsApproving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: portfolio.studentId._id,
          remark: remark.trim() || "Portfolio approved by admin",
        }),
      });

      const data = await res.json();
      if (res.ok && data.portfolio) {
        setPortfolio(data.portfolio);
        setSuccessMessage("✅ Portfolio approved successfully!");

        // Navigate to generated portfolio page
        setTimeout(() => {
          navigate(`/admin/portfolio-generated/${portfolio._id}`, {
            state: { portfolio: data.portfolio },
          });
        }, 1000);
      } else {
        alert(data.message || "Failed to approve portfolio");
      }
    } catch (err) {
      console.error("Failed to approve portfolio:", err);
      alert("Server error while approving portfolio");
    } finally {
      setIsApproving(false);
    }
  };

  const rejectPortfolio = async () => {
    if (!portfolio) return;

    if (!remark.trim()) {
      alert("Please add a remark before rejecting");
      return;
    }

    setIsRejecting(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: portfolio.studentId._id,
          remark: remark.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.portfolio) {
        setPortfolio(data.portfolio);
        setSuccessMessage("❌ Portfolio rejected successfully!");
      } else {
        alert(data.message || "Failed to reject portfolio");
      }
    } catch (err) {
      console.error("Failed to reject portfolio:", err);
      alert("Server error while rejecting portfolio");
    } finally {
      setIsRejecting(false);
    }
  };

  const generatePortfolio = () => {
    if (!portfolio) return;
    navigate(`/admin/portfolio-generated/${portfolio._id}`, {
      state: { portfolio },
    });
  };

  // ----------------------------
  // Status Badge Component
  // ----------------------------
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending Review
          </Badge>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get all sections data
  const allSections = portfolio?.studentSections || {};

  // Get file statistics
  const getFileStats = () => {
    if (!portfolio?.studentSections) return { totalFiles: 0, totalSections: 0 };

    let totalFiles = 0;
    const sections = Object.entries(portfolio.studentSections);

    sections.forEach(([_, section]) => {
      if (section.files) {
        totalFiles += Object.keys(section.files).length;
      }
    });

    return { totalFiles, totalSections: sections.length };
  };

  const fileStats = getFileStats();
  const profilePhotoUrl = getProfilePhotoUrl();
  const pdfUrl = getPdfUrl();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading portfolio details...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Alert className="max-w-md bg-white shadow-lg border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            Portfolio not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/admin/dashboard")}
                  className="rounded-full border-slate-200 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                    Portfolio Review
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Review and evaluate student portfolio submission
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(portfolio.status)}
                {pdfUrl && (
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => window.open(pdfUrl, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}
                {portfolio.status === "approved" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={generatePortfolio}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Student Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Profile Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-blue-100">
                    <AvatarImage src={profilePhotoUrl || undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {getInitials(portfolio.studentId.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {portfolio.studentId.name}
                    </h3>
                    <p className="text-slate-600 text-sm">Student</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">
                      {portfolio.studentId.course}
                    </span>
                  </div>
                  {portfolio.studentId.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">
                        {portfolio.studentId.email}
                      </span>
                    </div>
                  )}
                  {portfolio.studentId.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">
                        {portfolio.studentId.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">
                      Submitted:{" "}
                      {new Date(portfolio.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* File Statistics */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {fileStats.totalSections}
                      </p>
                      <p className="text-xs text-slate-600">Sections</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {fileStats.totalFiles}
                      </p>
                      <p className="text-xs text-slate-600">Files</p>
                    </div>
                  </div>
                </div>

                {portfolio.remark && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-medium text-slate-700 mb-2">
                      Admin Remark
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {portfolio.remark}
                    </p>
                  </div>
                )}

                {portfolio.status === "approved" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Portfolio approved and ready for download.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Admin Actions
                </CardTitle>
                <CardDescription>
                  Review and make decision on this portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Admin Remark
                  </label>
                  <Textarea
                    className="w-full border-slate-200 focus:border-blue-300 focus:ring-blue-200 min-h-[100px]"
                    placeholder="Add your feedback or remarks for the student..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white shadow-green-200 shadow-sm transition-all duration-200"
                    onClick={approvePortfolio}
                    disabled={portfolio.status === "approved" || isApproving}
                  >
                    {isApproving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Generate PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 shadow-sm transition-all duration-200"
                    onClick={rejectPortfolio}
                    disabled={portfolio.status === "rejected" || isRejecting}
                  >
                    {isRejecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Portfolio
                      </>
                    )}
                  </Button>
                </div>

                {successMessage && (
                  <Alert
                    className={
                      successMessage.includes("✅")
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  >
                    {successMessage.includes("✅") ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        successMessage.includes("✅")
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Portfolio Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sections">All Sections</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Profile Section */}
                    {allSections.profile?.data && (
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                          {sectionIcons.profile}
                          <h3 className="text-xl font-semibold text-slate-800">
                            {displayNameMap.profile}
                          </h3>
                        </div>
                        {renderDataAsText(allSections.profile.data, "profile")}
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(allSections).map(([key, section]) =>
                        section.data ||
                        (section.files &&
                          Object.keys(section.files).length > 0) ? (
                          <Card
                            key={key}
                            className="bg-white border-slate-200 text-center p-4 hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-2">
                              <div className="text-blue-600 flex justify-center mb-2">
                                {sectionIcons[key]}
                              </div>
                              <p className="text-sm font-medium text-slate-700">
                                {displayNameMap[key]}
                              </p>
                              <Badge
                                variant="secondary"
                                className="mt-2 bg-blue-50 text-blue-700"
                              >
                                Completed
                              </Badge>
                            </CardContent>
                          </Card>
                        ) : null
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="sections" className="space-y-6 mt-6">
                    {Object.entries(allSections).map(([key, section]) =>
                      section.data ||
                      (section.files &&
                        Object.keys(section.files).length > 0) ? (
                        <Card
                          key={key}
                          className="border-slate-200 hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {sectionIcons[key]}
                              {displayNameMap[key]}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Profile Image */}
                            {key === "profile" && section.files?.photo && (
                              <div className="flex justify-center mb-4">
                                <img
                                  src={getFileUrl(section.files.photo) || ""}
                                  alt="Profile"
                                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                                />
                              </div>
                            )}

                            {/* Section Data */}
                            {section.data && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-green-600" />
                                  Details & Information
                                </h4>
                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                  {renderDataAsText(section.data, key)}
                                </div>
                              </div>
                            )}

                            {/* Files Section */}
                            {section.files &&
                              Object.keys(section.files).length > 0 && (
                                <div className="pt-4 border-t border-slate-200">
                                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <Download className="h-4 w-4 text-purple-600" />
                                    Attached Files
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(section.files).map(
                                      ([fileKey, filePath]) =>
                                        fileKey !== "photo" ? (
                                          <div
                                            key={fileKey}
                                            className="bg-white border border-slate-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                                          >
                                            {renderFilePreview(
                                              filePath,
                                              fileKey
                                            )}
                                            <p className="text-sm text-slate-700 mt-2 font-medium capitalize">
                                              {fileKey.replace(/_/g, " ")}
                                            </p>
                                          </div>
                                        ) : null
                                    )}
                                  </div>
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      ) : null
                    )}
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolioDetails;
