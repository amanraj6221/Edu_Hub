// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\FAQ.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question:
        "What is EduSangrah and how does it benefit educational institutions?",
      answer:
        "EduSangrah is a comprehensive student activity and achievement management platform designed for colleges and universities in Jammu and Kashmir. It centralizes tracking of conferences, workshops, certifications, internships, and other academic activities while providing automated NAAC/NIRF compliance reporting, digital portfolio generation, and real-time analytics.",
    },
    {
      question: "How do students submit their activities and achievements?",
      answer:
        "Students can easily upload their certificates, reports, and documents through a user-friendly dashboard. They can categorize activities (conferences, workshops, certifications, internships, leadership roles), add descriptions, and submit them for faculty approval. The system supports multiple file formats and provides guided submission forms.",
    },
    {
      question: "What is the faculty approval process?",
      answer:
        "Faculty members receive real-time notifications when students submit activities. They can review submissions, verify documents, approve or reject with feedback, and track departmental student progress. The system includes bulk approval features and detailed audit trails for all decisions.",
    },
    {
      question: "How does EduSangrah help with NAAC and NIRF compliance?",
      answer:
        "The platform automatically categorizes and scores activities according to NAAC and NIRF criteria. It generates comprehensive reports, maintains proper documentation, tracks student engagement metrics, and provides ready-to-submit compliance reports that significantly reduce manual preparation time.",
    },
    {
      question:
        "Can the platform integrate with existing college management systems?",
      answer:
        "Yes, EduSangrah is designed with API hooks for seamless integration with existing Learning Management Systems (LMS), ERP platforms, and student information systems. We provide technical support for custom integrations based on institutional requirements.",
    },
    {
      question: "What security measures are in place to protect student data?",
      answer:
        "EduSangrah implements enterprise-grade security including encrypted data storage, secure authentication, role-based access control, regular security audits, and compliance with data protection regulations. All sensitive information is protected with industry-standard security protocols.",
    },
    {
      question: "How does the digital portfolio generation work?",
      answer:
        "The system automatically compiles approved student activities into professional digital portfolios. These can be downloaded as PDFs, shared via secure links, customized with institutional branding, and updated in real-time as new activities are approved. Perfect for job applications and further studies.",
    },
    {
      question: "What support and training is provided for institutions?",
      answer:
        "We provide comprehensive onboarding including system setup, user training for students/faculty/administrators, ongoing technical support, regular platform updates, and dedicated account management for institutional partners throughout Jammu and Kashmir.",
    },
  ];

  return (
    <section className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common questions about EduSangrah and how it can
            transform your educational institution's activity management
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-lg border-0 shadow-card px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
