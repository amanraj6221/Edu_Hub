// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Statistics.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  GraduationCap,
  Building,
  Award,
  FileCheck,
} from "lucide-react";

const Statistics = () => {
  const stats = [
    {
      icon: Users,
      number: "100+",
      label: "Active Students",
      description: "Students actively using the platform",
    },
    {
      icon: Building,
      number: "50+",
      label: "Partner Institutions",
      description: "Colleges and universities integrated",
    },
    {
      icon: GraduationCap,
      number: "200+",
      label: "Faculty Members",
      description: "Educators managing student activities",
    },
    {
      icon: Award,
      number: "10+",
      label: "Activities Tracked",
      description: "Conferences, workshops, certifications logged",
    },
    {
      icon: FileCheck,
      number: "500+",
      label: "Digital Portfolios",
      description: "Generated verified portfolios",
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Approval Rate",
      description: "Activities approved by faculty",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Platform Impact & Statistics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how EduSangrah is transforming education management across Jammu
            and Kashmir
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </h3>
                <h4 className="text-xl font-semibold mb-2">{stat.label}</h4>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
