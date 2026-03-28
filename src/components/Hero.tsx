// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Hero.tsx
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Brain,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-white/90 to-gray-50 dark:from-gray-900/90 dark:to-gray-800/95 py-24 lg:py-36 overflow-hidden">
      {/* Floating Gradient Blobs & Parallax Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 opacity-10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-300 via-green-400 to-teal-400 opacity-10 rounded-full blur-2xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 w-[650px] h-[650px] bg-gradient-to-r from-purple-300 via-blue-400 to-pink-300 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 lg:space-y-12 z-10">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20 px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                Job-Ready Digital Portfolios
              </span>
              <div className="w-2 h-2 bg-primary rounded-full ml-2 animate-pulse" />
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
                Smart{" "}
                <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient">
                  Student Portfolios
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium text-muted-foreground mt-1">
                  Approved by Faculty & Admin
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                Transform your achievements into verified, The Job Bridge
                Platform portfolios. Faculty approvals, admin verification, and
                interactive dashboards ensure your portfolio is **100%
                job-ready**.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 flex items-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Build Your Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 text-foreground hover:bg-primary/10 font-medium px-8 py-3 rounded-2xl flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                  25K+
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Students Registered
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                  500+
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Institutions
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                  98%
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Verified Portfolios
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Dashboard */}
          <div className="relative z-10">
            <div className="relative bg-white dark:bg-gray-900 border border-border rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Student Dashboard
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-5">
                {/* Progress Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Projects
                        </p>
                        <p className="text-xl font-bold text-foreground">12</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-pink-50 p-4 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Achievements
                        </p>
                        <p className="text-xl font-bold text-foreground">28</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Course Progress
                    </span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 p-4 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Performance Analytics
                      </p>
                      <p className="text-xs text-muted-foreground">
                        EduSangrah insights available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 animate-float-slow">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-semibold">The Job Bridge</span>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 border border-border px-3 py-2 rounded-2xl shadow-lg animate-float-reverse">
              <span className="text-sm font-medium text-foreground">
                Faculty & Admin Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
