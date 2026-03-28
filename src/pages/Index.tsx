import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import Statistics from "@/components/Statistics";
import Workflow from "@/components/Workflow";
import Testimonials from "@/components/Testimonials";
import Integration from "@/components/Integration";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <UserTypes />
      <Features />
      <Statistics />
      <Workflow />
      <Testimonials />
      <Integration />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
