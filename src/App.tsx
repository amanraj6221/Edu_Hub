import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Public Pages ---
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// --- Student Pages ---
import StudentRegister from "./pages/student/StudentRegister";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";

// --- Student Sections ---
import PersonalProfile from "./pages/student/sections/PersonalProfile";
import EducationSection from "./pages/student/sections/EducationSection";
import ExperienceSection from "./pages/student/sections/ExperienceSection";
import SkillsSection from "./pages/student/sections/SkillsSection";
import CertificationsSection from "./pages/student/sections/CertificationsSection";
import TrainingSection from "./pages/student/sections/TrainingSection";
import VolunteerSection from "./pages/student/sections/VolunteerSection";
import AdditionalInfoSection from "./pages/student/sections/AdditionalInfoSection";
import FinalSubmitSection from "./pages/student/sections/FinalSubmitSection";
import ProjectsSection from "./pages/student/sections/ProjectsSection";
import SocialLinksSection from "./pages/student/sections/SocialLinksSection";
import PortfolioStatus from "./pages/student/sections/PortfolioStatus";
import EPortfolio from "./pages/student/sections/EPortfolio";

// --- Faculty Pages ---
import FacultyRegister from "./pages/faculty/FacultyRegister";
import FacultyLogin from "./pages/faculty/FacultyLogin";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import CertificateValidation from "./pages/faculty/CertificateValidation";
import DocumentVerification from "./pages/faculty/DocumentVerification";
import NewApplications from "./pages/faculty/NewApplications";
import FacultyApplicationDetails from "./pages/faculty/dashboard/FacultyApplicationDetails";
import PortfolioReady from "./pages/faculty/PortfolioReady";
import FacultyLayout from "./layouts/FacultyLayout";

// --- Admin Pages ---
import AdminRegister from "./pages/admin/AdminRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminPortfolioDetails from "./pages/admin/dashboard/AdminPortfolioDetails";
import AdminPortfolioSummary from "./pages/admin/AdminPortfolioSummary";
import ManageDepartments from "./pages/admin/ManageDepartments";
import AuditManagement from "./pages/admin/AuditManagement";
import ManageUsers from "./pages/admin/ManageUsers";
import NaacAicteReports from "./pages/admin/dashboard/NaacAicteReports";
import PortfolioGenerated from "./pages/admin/PortfolioGenerated";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminApprovalSuccess from "./pages/admin/AdminApprovalSuccess";

// --- Protected Route ---
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const studentId = "12345"; // Replace this with the logged-in student's ID

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />

            {/* ================= STUDENT ROUTES ================= */}
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard/*"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="overview" element={<StudentDashboard />} />
              <Route
                path="profile"
                element={<PersonalProfile studentId={studentId} />}
              />
              <Route
                path="education"
                element={<EducationSection studentId={studentId} />}
              />
              <Route
                path="experience"
                element={<ExperienceSection studentId={studentId} />}
              />
              <Route
                path="skills"
                element={<SkillsSection studentId={studentId} />}
              />
              <Route
                path="certifications"
                element={<CertificationsSection studentId={studentId} />}
              />
              <Route
                path="training"
                element={<TrainingSection studentId={studentId} />}
              />
              <Route
                path="projects"
                element={<ProjectsSection studentId={studentId} />}
              />
              <Route
                path="social-links"
                element={<SocialLinksSection studentId={studentId} />}
              />
              <Route
                path="volunteer"
                element={<VolunteerSection studentId={studentId} />}
              />
              <Route
                path="additional-info"
                element={<AdditionalInfoSection studentId={studentId} />}
              />
              <Route
                path="final-submit"
                element={<FinalSubmitSection studentId={studentId} />}
              />
              <Route
                path="portfolio-status"
                element={<PortfolioStatus studentId={studentId} />}
              />
              <Route
                path="e-portfolio"
                element={<EPortfolio studentId={studentId} />}
              />
            </Route>

            {/* ================= FACULTY ROUTES ================= */}
            <Route path="/faculty/register" element={<FacultyRegister />} />
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route
              path="/faculty/dashboard/*"
              element={
                <ProtectedRoute role="faculty">
                  <FacultyLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FacultyDashboard />} />
              <Route path="home" element={<FacultyDashboard />} />
              <Route
                path="certificate-validation"
                element={<CertificateValidation />}
              />
              <Route
                path="document-verification"
                element={<DocumentVerification />}
              />
              <Route path="new-applications" element={<NewApplications />} />
              <Route
                path="application/:id"
                element={<FacultyApplicationDetails />}
              />
              <Route path="portfolio-ready/:id" element={<PortfolioReady />} />
            </Route>

            {/* ================= ADMIN ROUTES ================= */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="home" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="departments" element={<ManageDepartments />} />
              <Route path="naac-aicte" element={<NaacAicteReports />} />{" "}
              {/* ✅ Connected here */}
              <Route path="audit-management" element={<AuditManagement />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route
                path="portfolio-summary"
                element={<AdminPortfolioSummary />}
              />
              <Route path="portfolio/:id" element={<AdminPortfolioDetails />} />
              <Route
                path="approval-success"
                element={<AdminApprovalSuccess />}
              />
            </Route>

            {/* Direct Admin Portfolio Generated Page */}
            <Route
              path="/admin/portfolio-generated/:id"
              element={
                <ProtectedRoute role="admin">
                  <PortfolioGenerated />
                </ProtectedRoute>
              }
            />

            {/* ================= NOT FOUND ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
