// 📂 src/pages/admin/PortfolioGenerated.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

interface SectionData {
  data?: any;
  files?: Record<string, string>;
}

interface Portfolio {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    course: string;
    email?: string;
    phone?: string;
    title?: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  remark?: string;
  pdfUrl?: string;
  data?: Record<string, any>;
  files?: Record<string, any>;
}

const displayNameMap: Record<string, string> = {
  profile: "Personal Profile",
  education: "Education",
  experience: "Work Experience",
  skills: "Skills",
  certifications: "Certifications",
  training: "Training & Workshops",
  projects: "Projects",
  socialLinks: "Social Links",
  volunteer: "Volunteer Work",
  additionalInfo: "Additional Information",
};

const PortfolioGenerated: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [portfolio, setPortfolio] = useState<Portfolio | null>(
    (location.state as any)?.portfolio || null
  );
  const [loading, setLoading] = useState(!portfolio);
  const [uploading, setUploading] = useState(false);

  const fetchPortfolio = async () => {
    if (portfolio) return;
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${id}`);
      const data = await res.json();
      if (res.ok && data.success) setPortfolio(data.portfolio);
      else setPortfolio(null);
    } catch (err) {
      console.error("fetchPortfolio error:", err);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fileUrl = (path?: string) => {
    if (!path) return null;
    const rel = path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/");
    return `${API_BASE}/${rel}`;
  };

  const renderFileLink = (filePath: string, label?: string) => {
    const url = fileUrl(filePath);
    if (!url) return null;
    const name = label || url.split("/").pop();
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {name}
      </a>
    );
  };

  const generatePDF = async (options?: { filename?: string }) => {
    if (!contentRef.current || !portfolio) return;
    try {
      const rootEl = contentRef.current;
      const prevBoxShadows: string[] = [];
      const nodes = rootEl.querySelectorAll<HTMLElement>("*");
      nodes.forEach((n) => {
        prevBoxShadows.push(n.style.boxShadow || "");
        n.style.boxShadow = "none";
      });

      const canvas = await html2canvas(rootEl, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      nodes.forEach((n, i) => {
        n.style.boxShadow = prevBoxShadows[i] || "";
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename =
        options?.filename || `${portfolio.studentId.name}_portfolio.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("generatePDF error:", err);
      alert("PDF generation failed. Check console.");
    }
  };

  const generateAndUploadPDF = async () => {
    if (!contentRef.current || !portfolio) return;
    setUploading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");
      const form = new FormData();
      form.append("portfolioId", portfolio._id);
      form.append("file", pdfBlob, `${portfolio.studentId.name}_portfolio.pdf`);

      const res = await fetch(`${API_BASE}/api/portfolio/upload-pdf`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPortfolio((p) => (p ? { ...p, pdfUrl: data.pdfUrl } : p));
        alert(
          "PDF uploaded & attached to portfolio. Students can now download it."
        );
      } else {
        console.warn("upload response:", data);
        alert(data?.message || "Upload failed. Check backend.");
      }
    } catch (err) {
      console.error("generateAndUploadPDF error:", err);
      alert("Failed to generate/upload PDF. See console.");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 font-medium text-lg">
        Loading portfolio...
      </div>
    );

  if (!portfolio)
    return (
      <div className="p-6 text-center text-red-500 font-medium text-lg">
        Portfolio not found.
      </div>
    );

  // ------------------- Full Data Mapping -------------------
  const allSections: Record<string, SectionData> = {};
  Object.keys(displayNameMap).forEach((key) => {
    allSections[key] = {
      data: portfolio.data?.[key] || {},
      files: portfolio.files?.[key] || {},
    };
  });

  const renderList = (maybe: any) => {
    if (!maybe) return null;
    if (Array.isArray(maybe))
      return maybe.map((m, i) => (
        <li key={i}>{typeof m === "string" ? m : JSON.stringify(m)}</li>
      ));
    if (typeof maybe === "object")
      return Object.entries(maybe).map(([k, v]) => (
        <li key={k}>
          <strong>{k}:</strong> {String(v)}
        </li>
      ));
    return <span>{String(maybe)}</span>;
  };

  const renderObjectAsText = (obj: any) => {
    if (!obj) return null;
    if (typeof obj === "string") return obj;
    if (Array.isArray(obj)) {
      return obj.map((item, index) => (
        <div key={index} className="mb-2">
          {typeof item === "object" ? renderObjectAsText(item) : String(item)}
        </div>
      ));
    }
    if (typeof obj === "object") {
      return Object.entries(obj).map(([key, value]) => (
        <div key={key} className="mb-1">
          <strong>{key}:</strong> {renderObjectAsText(value)}
        </div>
      ));
    }
    return String(obj);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolio / CV — Preview</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => generatePDF()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download PDF (Quick)
          </Button>
          <Button
            onClick={() => generateAndUploadPDF()}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Generate & Upload PDF"}
          </Button>
          <Button
            onClick={() => navigate("/admin/admin-portfolio-summary")}
            className="bg-gray-400 hover:bg-gray-500 text-white"
          >
            Back
          </Button>
        </div>
      </div>

      <div
        ref={(el) => (contentRef.current = el)}
        className="bg-white print:bg-white rounded-lg overflow-hidden border border-gray-200"
        style={{ padding: 24, boxShadow: "none" }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6 mb-6">
          <div className="flex-shrink-0">
            {allSections.profile.files?.photo ? (
              <img
                src={fileUrl(allSections.profile.files.photo) || ""}
                alt="profile"
                className="w-44 h-44 object-cover rounded-full border-4 border-indigo-500 shadow-sm"
              />
            ) : (
              <div className="w-44 h-44 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed">
                No Photo
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-gray-900">
              {portfolio.data?.profile?.firstName || portfolio.studentId.name}
            </h2>
            <p className="text-lg text-gray-700 mt-1">
              {portfolio.data?.profile?.course ||
                portfolio.studentId.course ||
                ""}
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {portfolio.data?.profile?.email && (
                <div>✉️ {portfolio.data.profile.email}</div>
              )}
              {portfolio.data?.profile?.contact && (
                <div>📞 {portfolio.data.profile.contact}</div>
              )}
              {portfolio.data?.profile?.dob && (
                <div>🎂 {portfolio.data.profile.dob}</div>
              )}
              <div>
                🕒 Submitted: {new Date(portfolio.submittedAt).toLocaleString()}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    portfolio.status === "Approved"
                      ? "bg-green-600"
                      : portfolio.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                  }`}
                >
                  {portfolio.status}
                </span>
              </div>
            </div>
            {portfolio.remark && (
              <p className="mt-3 italic text-gray-700">
                <strong>Admin Remark:</strong> {portfolio.remark}
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <aside className="md:col-span-4 space-y-6">
            {allSections.profile.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Summary</h4>
                <p className="text-sm text-gray-700">
                  {allSections.profile.data.professionalSummary ||
                    allSections.profile.data.objective ||
                    ""}
                </p>
              </div>
            )}

            {allSections.skills.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Skills</h4>
                {Array.isArray(allSections.skills.data)
                  ? allSections.skills.data.map((s: any, i: number) => (
                      <div key={i} className="mb-3">
                        <strong className="text-gray-800">{s.name}</strong>
                        <ul className="flex flex-wrap gap-2 mt-1">
                          {s.items.map((item: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  : renderObjectAsText(allSections.skills.data)}
              </div>
            )}

            {allSections.socialLinks.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Links</h4>
                <ul className="text-sm space-y-2">
                  {Object.entries(allSections.socialLinks.data).map(
                    ([k, v]) => (
                      <li key={k}>
                        <strong className="text-gray-800">{k}:</strong>{" "}
                        {typeof v === "string" ? (
                          <a
                            href={v}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {v}
                          </a>
                        ) : (
                          renderObjectAsText(v)
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {allSections.certifications.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Certifications</h4>
                <div className="text-sm space-y-2">
                  {Array.isArray(allSections.certifications.data)
                    ? allSections.certifications.data.map(
                        (c: any, i: number) => (
                          <div key={i} className="p-2 bg-gray-50 rounded">
                            {renderObjectAsText(c)}
                          </div>
                        )
                      )
                    : renderObjectAsText(allSections.certifications.data)}
                </div>
              </div>
            )}

            {allSections.training.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Training & Workshops
                </h4>
                <div className="text-sm space-y-2">
                  {renderObjectAsText(allSections.training.data)}
                </div>
              </div>
            )}

            {allSections.additionalInfo.data && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Other</h4>
                <div className="text-sm text-gray-700">
                  {renderObjectAsText(allSections.additionalInfo.data)}
                </div>
              </div>
            )}
          </aside>

          <main className="md:col-span-8 space-y-6">
            {allSections.education.data &&
              Array.isArray(allSections.education.data) && (
                <section>
                  <h3 className="text-2xl font-bold mb-3">Education</h3>
                  <div className="space-y-3">
                    {allSections.education.data.map((edu: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded border border-gray-100 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {edu.level} — {edu.institute}
                            </p>
                            <p className="text-sm text-gray-600">
                              {edu.boardOrUniversity || ""}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600">
                            {edu.year || ""}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          {edu.percentage ? `Result: ${edu.percentage}` : ""}
                        </div>
                        {edu.description && (
                          <div className="mt-2 text-sm text-gray-700">
                            {edu.description}
                          </div>
                        )}
                        {allSections.education.files &&
                          Object.values(allSections.education.files).map(
                            (f: string, i: number) => (
                              <div key={i} className="mt-1 text-sm">
                                {renderFileLink(f)}
                              </div>
                            )
                          )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {allSections.experience.data && (
              <section>
                <h3 className="text-2xl font-bold mb-3">Experience</h3>
                <div className="space-y-3">
                  {Array.isArray(allSections.experience.data)
                    ? allSections.experience.data.map((exp: any, i: number) => (
                        <div key={i} className="p-4 border rounded">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">
                                {exp.position || exp.role || exp.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {exp.company || exp.organization}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              {exp.duration}
                            </div>
                          </div>
                          {exp.description && (
                            <div className="mt-2 text-sm text-gray-700">
                              {exp.description}
                            </div>
                          )}
                          {exp.skills && (
                            <div className="mt-1 text-sm text-gray-700">
                              <strong>Skills:</strong> {exp.skills}
                            </div>
                          )}
                          {allSections.experience.files &&
                            Object.values(allSections.experience.files).map(
                              (f: string, i: number) => (
                                <div key={i} className="mt-1 text-sm">
                                  {renderFileLink(f)}
                                </div>
                              )
                            )}
                        </div>
                      ))
                    : renderObjectAsText(allSections.experience.data)}
                </div>
              </section>
            )}

            {allSections.projects.data && (
              <section>
                <h3 className="text-2xl font-bold mb-3">Projects</h3>
                <div className="space-y-3">
                  {Array.isArray(allSections.projects.data)
                    ? allSections.projects.data.map((p: any, i: number) => (
                        <div key={i} className="p-4 border rounded">
                          <p className="font-semibold">
                            {p.projectTitle || p.name}
                          </p>
                          <p className="text-sm text-gray-600">{p.duration}</p>
                          <div className="mt-1 text-sm text-gray-700">
                            {p.projectDescription || p.summary}
                          </div>
                          {p.technologiesUsed && (
                            <div className="mt-1 text-sm">
                              <strong>Technologies:</strong>{" "}
                              {p.technologiesUsed}
                            </div>
                          )}
                          {p.githubLink && (
                            <div className="mt-1 text-sm">
                              <a
                                href={p.githubLink}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Github
                              </a>
                            </div>
                          )}
                          {p.liveDemoLink && (
                            <div className="mt-1 text-sm">
                              <a
                                href={p.liveDemoLink}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Live Demo
                              </a>
                            </div>
                          )}
                          {allSections.projects.files &&
                            Object.values(allSections.projects.files).map(
                              (f: string, i: number) => (
                                <div key={i} className="mt-1 text-sm">
                                  {renderFileLink(f)}
                                </div>
                              )
                            )}
                        </div>
                      ))
                    : renderObjectAsText(allSections.projects.data)}
                </div>
              </section>
            )}

            {allSections.volunteer.data && (
              <section>
                <h3 className="text-2xl font-bold mb-3">Volunteer Work</h3>
                <div className="space-y-3">
                  {Array.isArray(allSections.volunteer.data)
                    ? allSections.volunteer.data.map((v: any, i: number) => (
                        <div key={i} className="p-4 border rounded">
                          <p className="font-semibold">
                            {v.role} — {v.organization}
                          </p>
                          <p className="text-sm text-gray-600">{v.duration}</p>
                          <div className="mt-1 text-sm text-gray-700">
                            {v.description}
                          </div>
                          {v.skillsUsed && (
                            <div className="mt-1 text-sm">
                              <strong>Skills:</strong> {v.skillsUsed}
                            </div>
                          )}
                          {allSections.volunteer.files &&
                            Object.values(allSections.volunteer.files).map(
                              (f: string, i: number) => (
                                <div key={i} className="mt-1 text-sm">
                                  {renderFileLink(f)}
                                </div>
                              )
                            )}
                        </div>
                      ))
                    : renderObjectAsText(allSections.volunteer.data)}
                </div>
              </section>
            )}

            {allSections.additionalInfo.data && (
              <section>
                <h3 className="text-2xl font-bold mb-3">
                  Additional Information
                </h3>
                <div className="text-sm text-gray-700">
                  {renderObjectAsText(allSections.additionalInfo.data)}
                </div>
              </section>
            )}
          </main>
        </div>

        <div className="mt-8 border-t pt-4 text-sm text-gray-600 flex items-center justify-between">
          <div>
            {portfolio.pdfUrl ? (
              <a
                href={portfolio.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View uploaded PDF
              </a>
            ) : (
              <span className="text-gray-500">
                PDF not uploaded to server yet.
              </span>
            )}
          </div>
          <div className="text-right">
            <div>Generated by EducationHub</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGenerated;
