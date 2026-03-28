import React, { useState, useEffect } from "react";

const EPortfolio: React.FC = () => {
  // Get student info from localStorage
  const storedUser = localStorage.getItem("student_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id || user?.id;

  const API_BASE = "http://localhost:5000";

  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState<"template-1" | "template-2">(
    "template-1"
  );

  // -------------------- Fetch Latest PDF --------------------
  const fetchPdfLink = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/student/${studentId}`);
      if (res.ok) {
        const result = await res.json();
        setPdfLink(
          result.data?.pdfLink ? `${API_BASE}${result.data.pdfLink}` : null
        ); // ✅ prepend API_BASE
      } else {
        setPdfLink(null);
      }
    } catch (err) {
      console.error("Error fetching PDF link:", err);
      setPdfLink(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfLink();
  }, [studentId]);

  // -------------------- Generate or Regenerate PDF --------------------
  const handleGenerate = async (
    selectedTemplate?: "template-1" | "template-2"
  ) => {
    if (!studentId) return;
    const templateToUse = selectedTemplate || template;
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/pdf/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, templateId: templateToUse }),
      });
      const result = await res.json();
      if (result.success) {
        setPdfLink(`${API_BASE}${result.pdfLink}`);
        alert("✅ Portfolio PDF generated successfully!");
      } else {
        alert("❌ Failed to generate PDF: " + result.message);
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("❌ Server error during PDF generation.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading portfolio...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">E-Portfolio</h2>

      {!pdfLink ? (
        <>
          <p className="text-gray-600 mb-4">
            Your digital portfolio has not been generated yet.
          </p>

          {/* Template Selection */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Template:</label>
            <select
              value={template}
              onChange={(e) =>
                setTemplate(e.target.value as "template-1" | "template-2")
              }
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="template-1">Template 1</option>
              <option value="template-2">Template 2</option>
            </select>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={generating}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:opacity-90 transition"
          >
            {generating ? "Generating..." : "Generate Portfolio"}
          </button>
        </>
      ) : (
        <>
          {/* PDF Display */}
          <iframe
            src={pdfLink}
            className="w-full h-[80vh] border rounded-xl mb-4"
            title="Student E-Portfolio"
          />

          {/* Regenerate PDF */}
          <div className="mt-2 flex items-center gap-2">
            <label className="block mb-1 font-medium">Change Template:</label>
            <select
              value={template}
              onChange={(e) =>
                setTemplate(e.target.value as "template-1" | "template-2")
              }
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="template-1">Template 1</option>
              <option value="template-2">Template 2</option>
            </select>
            <button
              onClick={() => handleGenerate(template)}
              disabled={generating}
              className="px-5 py-3 rounded-xl bg-green-600 text-white shadow hover:opacity-90 transition"
            >
              {generating ? "Generating..." : "Regenerate PDF"}
            </button>
          </div>

          {/* Download PDF */}
          <div className="mt-4">
            <a
              href={pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white shadow hover:opacity-90 transition"
            >
              Download PDF
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default EPortfolio;
