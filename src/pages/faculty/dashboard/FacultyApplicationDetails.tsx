// C:\Users\Aman Raj\EducationHub\EducationHub\src\pages\faculty\dashboard\FacultyApplicationDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
let socket: Socket;

interface SectionData {
  data?: any;
  files?: Record<string, string>;
}

interface Application {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    course: string;
    email?: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  remark?: string;
  pdfUrl?: string;
  sections?: Record<string, SectionData>;
  studentSections?: Record<string, SectionData>;
}

const displayNameMap: Record<string, string> = {
  profile: "Personal Profile",
  education: "Education Details",
  experience: "Work Experience",
  skills: "Skills & Competencies",
  certifications: "Certifications",
  training: "Training & Workshops",
  projects: "Projects",
  socialLinks: "Social Links",
  volunteer: "Volunteer Work",
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

const FacultyApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // ----------------------------
  // Fetch Portfolio Details
  // ----------------------------
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setApplication(data.portfolio);
        setRemark(data.portfolio.remark || "");
      } else {
        setApplication(null);
      }
    } catch (err) {
      console.error("Error fetching application:", err);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Socket for real-time updates
  // ----------------------------
  useEffect(() => {
    socket = io(API_BASE);

    socket.on("portfolio_update", (update: any) => {
      if (update.studentId === application?.studentId._id) {
        setApplication((prev) =>
          prev
            ? {
                ...prev,
                status: update.status,
                remark: update.remark,
                pdfUrl: update.pdfUrl,
              }
            : prev
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [application?.studentId._id]);

  // ----------------------------
  // Approve/Reject Portfolio
  // ----------------------------
  const updateStatus = async (status: "Approved" | "Rejected") => {
    if (!application) return;

    const route = status === "Approved" ? "approve" : "reject";

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: application.studentId._id,
          remark,
        }),
      });

      const data = await res.json();
      if (res.ok && data.portfolio) {
        setApplication(data.portfolio);

        // ----------------------------
        // Socket emit to notify admin immediately
        // ----------------------------
        socket.emit("portfolio_update", {
          event: status === "Approved" ? "forwarded" : "rejected",
          studentId: application.studentId._id,
          portfolioId: data.portfolio._id,
          status: data.portfolio.status,
          remark: data.portfolio.remark || "",
          studentSections: data.portfolio.studentSections || {},
          pdfUrl: data.portfolio.pdfUrl || null,
        });

        alert(
          status === "Approved"
            ? "Application approved and forwarded to admin."
            : "Application rejected."
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
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

  const fileUrl = (filePath: string) => {
    if (!filePath) return null;
    const relativePath = filePath.replace(/^.*uploads[\\/]/, "uploads/");
    return `${API_BASE}/${relativePath.replace(/\\/g, "/")}`;
  };

  const renderFileLink = (filePath: string, label?: string) => {
    const url = fileUrl(filePath);
    if (!url) return null;
    const name = label || url.split("/").pop();
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        <Download className="h-4 w-4 mr-1" />
        {name}
      </a>
    );
  };

  const renderDataAsText = (data: any) => {
    if (typeof data === "string") return data;
    if (typeof data === "number" || typeof data === "boolean")
      return String(data);
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <div
          key={index}
          className="mb-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          {typeof item === "object" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-sm font-medium text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <p className="text-slate-800">{String(value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-800">{String(item)}</p>
          )}
        </div>
      ));
    }
    if (typeof data === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <span className="text-sm font-medium text-slate-600 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <p className="text-slate-800">{String(value)}</p>
            </div>
          ))}
        </div>
      );
    }
    return String(data);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading application details...</p>
        </div>
      </div>
    );

  if (!application)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Alert className="max-w-md bg-white shadow-lg border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            Application not found.
          </AlertDescription>
        </Alert>
      </div>
    );

  const allSections: Record<string, SectionData> = {};
  Object.keys(displayNameMap).forEach((key) => {
    const sectionData = application.sections?.[key];
    const studentSectionData = application.studentSections?.[key];

    allSections[key] = {
      data: studentSectionData?.data || sectionData?.data || null,
      files: studentSectionData?.files || sectionData?.files || {},
    };
  });

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
                  onClick={() => navigate("/faculty/new-applications")}
                  className="rounded-full border-slate-200 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                    Application Review
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Review and evaluate student portfolio submission
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(application.status)}
                {application.pdfUrl && (
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      window.open(fileUrl(application.pdfUrl!), "_blank")
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
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
                    <AvatarImage
                      src={
                        allSections.profile?.files?.photo
                          ? fileUrl(allSections.profile.files.photo)
                          : undefined
                      }
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {getInitials(application.studentId.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {application.studentId.name}
                    </h3>
                    <p className="text-slate-600 text-sm">Student</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">
                      {application.studentId.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">
                      {application.studentId.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">
                      Submitted:{" "}
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {application.remark && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-medium text-slate-700 mb-2">
                      Faculty Remark
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {application.remark}
                    </p>
                  </div>
                )}

                {application.status === "Approved" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Portfolio forwarded to admin for final approval.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Faculty Actions Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Faculty Actions
                </CardTitle>
                <CardDescription>
                  Review and make decision on this application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Faculty Remark
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
                    onClick={() => updateStatus("Approved")}
                    disabled={application.status === "Approved"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Forward to Admin
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 shadow-sm transition-all duration-200"
                    onClick={() => updateStatus("Rejected")}
                    disabled={application.status === "Rejected"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Application Content */}
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
                        {renderDataAsText(allSections.profile.data)}
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
                          <CardContent>
                            {/* Profile Image */}
                            {key === "profile" && section.files?.photo && (
                              <div className="mb-4">
                                <img
                                  src={fileUrl(section.files.photo) || ""}
                                  alt="Profile"
                                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
                                />
                              </div>
                            )}

                            {/* Education Table */}
                            {key === "education" &&
                            Array.isArray(section.data) ? (
                              <div className="overflow-x-auto">
                                <table className="w-full border border-slate-200 text-sm rounded-lg overflow-hidden">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Level
                                      </th>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Institute
                                      </th>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Board/University
                                      </th>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Year
                                      </th>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Percentage
                                      </th>
                                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                        Marksheet
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {section.data.map(
                                      (edu: any, idx: number) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-slate-50 transition-colors"
                                        >
                                          <td className="border border-slate-200 px-4 py-3 text-slate-700">
                                            {edu.level}
                                          </td>
                                          <td className="border border-slate-200 px-4 py-3 text-slate-700">
                                            {edu.institute}
                                          </td>
                                          <td className="border border-slate-200 px-4 py-3 text-slate-700">
                                            {edu.boardOrUniversity}
                                          </td>
                                          <td className="border border-slate-200 px-4 py-3 text-slate-700">
                                            {edu.year}
                                          </td>
                                          <td className="border border-slate-200 px-4 py-3 text-slate-700">
                                            {edu.percentage}
                                          </td>
                                          <td className="border border-slate-200 px-4 py-3">
                                            {section.files
                                              ? renderFileLink(
                                                  section.files[
                                                    `marksheet_${idx}`
                                                  ]
                                                )
                                              : null}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              /* Other Sections - Display as readable text */
                              section.data && (
                                <div className="space-y-3">
                                  {renderDataAsText(section.data)}
                                </div>
                              )
                            )}

                            {/* Files Section */}
                            {section.files &&
                              Object.keys(section.files).length > 0 &&
                              key !== "education" && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                  <h4 className="font-medium text-slate-700 mb-3">
                                    Attached Files
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    {Object.entries(section.files).map(
                                      ([fileKey, filePath]) =>
                                        fileKey !== "photo" ? (
                                          <div
                                            key={fileKey}
                                            className="bg-white border border-slate-200 rounded-lg px-3 py-2"
                                          >
                                            {renderFileLink(
                                              filePath,
                                              fileKey.replace(/_/g, " ")
                                            )}
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

export default FacultyApplicationDetails;
