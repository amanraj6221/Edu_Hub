// C:\Users\Aman Raj\EducationHub\EducationHub\src\components\Footer.tsx
import { GraduationCap, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">EduSangrah</h3>
                <p className="text-blue-200 text-sm">
                  Government of Jammu and Kashmir
                </p>
              </div>
            </div>

            <p className="text-blue-100 mb-6 max-w-md">
              Empowering educational institutions with comprehensive student
              activity management, digital portfolios, and compliance reporting
              for the future of education.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">info@edusangrah.jk.gov.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">+91-194-2440084</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">
                  Srinagar, Jammu and Kashmir, India
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  About Platform
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Government Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://jk.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors flex items-center"
                >
                  J&K Government
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.naac.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors flex items-center"
                >
                  NAAC
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nirfindia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors flex items-center"
                >
                  NIRF
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors flex items-center"
                >
                  AICTE
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-100 text-sm">
            © 2025 EduSangrah. Government of Jammu and Kashmir. All rights
            reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-blue-100 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-blue-100 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
