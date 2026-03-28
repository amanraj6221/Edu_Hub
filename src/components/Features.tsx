// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Features.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Award,
  BarChart3,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Globe,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Role-Based Access",
      description:
        "Separate dashboards for Students, Faculty, and Administrators with appropriate permissions and workflows.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Activity Management",
      description:
        "Upload and track conferences, workshops, certifications, internships, and leadership roles.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Award,
      title: "Digital Certificates",
      description:
        "Generate verified digital portfolios and certificates for academic and professional achievements.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time performance tracking with beautiful charts and comprehensive reporting tools.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Shield,
      title: "Faculty Approval",
      description:
        "Streamlined approval workflow for faculty to verify and validate student submissions.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: FileText,
      title: "NAAC/NIRF Ready",
      description:
        "Automated report generation for NAAC, AICTE, and NIRF compliance and accreditation.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Live notifications and updates for submissions, approvals, and important announcements.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "Robust validation system ensuring data accuracy and integrity across all submissions.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Globe,
      title: "LMS Integration",
      description:
        "Seamless integration with existing Learning Management Systems and ERP platforms.",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/20 relative overflow-hidden">
      {/* Subtle floating gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 opacity-10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-gradient-to-tr from-yellow-300 via-green-400 to-teal-400 opacity-10 rounded-full blur-2xl animate-float-reverse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 fade-in-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 gradient-text animate-text-gradient">
            Comprehensive Platform Features
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage student activities, track
            achievements, and generate compliance reports in one unified,
            futuristic platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group border-0 rounded-3xl shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500`}
              style={{
                animation: `fadeInUp 0.6s forwards`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <CardHeader>
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-500`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors duration-500">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional subtle particles / floating shapes */}
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-2xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-10 blur-2xl animate-float-reverse"></div>
    </section>
  );
};

export default Features;
