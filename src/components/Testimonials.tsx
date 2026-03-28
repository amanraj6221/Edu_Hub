// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Testimonials.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Rashid Ahmad",
      position: "Principal, Government College Srinagar",
      content:
        "EduSangrah has revolutionized how we track student achievements. The NAAC reporting feature alone saved us months of manual compilation work.",
      rating: 5,
      avatar: "👨‍🎓",
    },
    {
      name: "Priya Sharma",
      position: "Final Year Student, IT Department",
      content:
        "Having all my conferences, internships, and certifications in one place made my placement interviews so much easier. The digital portfolio is amazing!",
      rating: 5,
      avatar: "👩‍💻",
    },
    {
      name: "Prof. Mohammad Yaseen",
      position: "HOD Computer Science, NIT Srinagar",
      content:
        "The faculty approval workflow is seamless. I can quickly review and approve student submissions from anywhere. Great platform for academic administration.",
      rating: 5,
      avatar: "👨‍🏫",
    },
    {
      name: "Anjali Devi",
      position: "Student Coordinator, Kashmir University",
      content:
        "The analytics dashboard provides incredible insights into student engagement. We can now track departmental performance effectively.",
      rating: 5,
      avatar: "👩‍🎓",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from students, faculty, and administrators who are transforming
            their educational experience with EduSangrah
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-foreground italic text-lg leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
