// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\UserTypes.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Users,
  Settings,
  BookOpen,
  FileCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const UserTypes = () => {
  const userTypes = [
    {
      icon: User,
      title: "Students",
      subtitle: "Track Your Academic Journey",
      description:
        "Submit activities, track progress, and build your digital portfolio with verified achievements.",
      features: [
        "Upload conferences & workshops",
        "Track certifications & courses",
        "Access digital portfolio",
        "View academic analytics",
        "Submit internship reports",
      ],
      color: "from-blue-500 to-blue-600",
      buttonText: "Student Login",
    },
    {
      icon: Users,
      title: "Faculty",
      subtitle: "Guide & Verify Achievements",
      description:
        "Review student submissions, provide approvals, and monitor departmental performance.",
      features: [
        "Review student submissions",
        "Approve/reject activities",
        "Monitor student progress",
        "Generate department reports",
        "Mentor student development",
      ],
      color: "from-green-500 to-green-600",
      buttonText: "Faculty Login",
    },
    {
      icon: Settings,
      title: "Administrators",
      subtitle: "Manage & Oversee Platform",
      description:
        "Full platform control with comprehensive analytics, user management, and system configuration.",
      features: [
        "Platform-wide analytics",
        "Generate digital portfolio",
        "User account management",
        "System configuration",
        "Generate institutional reports",
        "NAAC/NIRF compliance",
      ],
      color: "from-purple-500 to-purple-600",
      buttonText: "Admin Dashboard",
    },
  ];

  return (
    <section className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access tailored features designed specifically for your role in the
            educational ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {userTypes.map((type, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border-0"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>

              <CardHeader className="relative">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  {type.title}
                </CardTitle>
                <p className="text-primary font-medium">{type.subtitle}</p>
              </CardHeader>

              <CardContent className="relative space-y-6">
                <p className="text-muted-foreground">{type.description}</p>

                <ul className="space-y-3">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center`}
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full bg-gradient-to-br ${type.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  {type.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
