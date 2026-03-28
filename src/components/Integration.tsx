// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Integration.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Cloud,
  Smartphone,
  Shield,
  Zap,
  Globe,
  BookOpen,
  Building,
} from "lucide-react";

const Integration = () => {
  const integrations = [
    {
      icon: Database,
      title: "ERP Integration",
      description:
        "Seamlessly connect with existing college ERP systems for unified data management and automated sync.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      title: "LMS Compatibility",
      description:
        "Works with popular Learning Management Systems like Moodle, Canvas, and Blackboard.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description:
        "Built on secure cloud infrastructure ensuring 99.9% uptime and scalable performance.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description:
        "Fully responsive design that works perfectly on desktops, tablets, and mobile devices.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Enterprise-grade security with encryption, secure authentication, and regular backups.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Live notifications, instant updates, and real-time synchronization across all user roles.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description:
        "Support for English, Hindi, Urdu, and Kashmiri languages for better accessibility.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Building,
      title: "Institutional Branding",
      description:
        "Customizable interface with institutional logos, colors, and branding elements.",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Technical Features & Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with modern technology stack and designed to integrate
            seamlessly with your existing educational infrastructure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {integrations.map((integration, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-0 shadow-card bg-white/90 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 ${integration.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <integration.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {integration.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {integration.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">
            Built with Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-medium">React</div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="text-lg font-medium">Node.js</div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="text-lg font-medium">MongoDB</div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="text-lg font-medium">Express</div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="text-lg font-medium">TailwindCSS</div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="text-lg font-medium">TypeScript</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
