// server/src/routes/portfolio.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const StudentData = require("../models/StudentData");
const StudentSection = require("../models/StudentSection");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

// -------------------------
// Ensure uploads/portfolios folder exists
// -------------------------
const pdfDir = path.join(__dirname, "../../uploads/portfolios");
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// -------------------------
// Helper: Generate Portfolio PDF
// -------------------------
async function generatePortfolioPDF(portfolio) {
  // Build HTML for PDF
  const html = `
    <html>
      <head>
        <title>Portfolio - ${portfolio.studentId.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f6f8; }
          h1 { text-align: center; color: #333; }
          h2 { color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .section { background: #fff; margin: 15px 0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);}
          table { width: 100%; border-collapse: collapse; margin-top: 10px;}
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
          .file-link { color: blue; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>${portfolio.studentId.name} — E-Portfolio</h1>
        ${Object.keys(portfolio.data || {})
          .map((sec) => {
            const sectionData = portfolio.data[sec] || {};
            const sectionFiles = portfolio.files?.[sec] || {};
            return `
            <div class="section">
              <h2>${sec}</h2>
              <table>
                <thead>
                  <tr><th>Field</th><th>Value</th></tr>
                </thead>
                <tbody>
                  ${Object.entries(sectionData)
                    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
                    .join("")}
                </tbody>
              </table>
              ${
                Object.keys(sectionFiles).length
                  ? `<h3>Files:</h3>
                     <table>
                       <thead><tr><th>File Name</th><th>URL</th></tr></thead>
                       <tbody>
                         ${Object.entries(sectionFiles)
                           .map(
                             ([fname, fpath]) =>
                               `<tr><td>${fname}</td><td><a class="file-link" href="${fpath}">${fpath}</a></td></tr>`
                           )
                           .join("")}
                       </tbody>
                     </table>`
                  : ""
              }
            </div>
          `;
          })
          .join("")}

        <div class="section">
          <h2>Status & Remark</h2>
          <p><strong>Status:</strong> ${portfolio.status}</p>
          <p><strong>Remark:</strong> ${portfolio.remark || "N/A"}</p>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const fileName = `portfolio_${portfolio.studentId._id}_${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);
  await page.pdf({ path: filePath, format: "A4", printBackground: true });
  await browser.close();

  return `/uploads/portfolios/${fileName}`;
}

// -------------------------
// Submit Portfolio (Student)
// -------------------------
router.post("/submit", async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const sections = await StudentSection.find({ studentId: studentObjectId });

    if (!sections.length)
      return res.status(400).json({ message: "No sections found to submit" });

    const mergedData = {};
    const mergedFiles = {};
    sections.forEach((sec) => {
      mergedData[sec.sectionId] = sec.data || {};
      mergedFiles[sec.sectionId] = sec.files || {};
    });

    let portfolio = await StudentData.findOne({ studentId: studentObjectId });
    if (!portfolio) {
      portfolio = new StudentData({
        studentId: studentObjectId,
        data: mergedData,
        files: mergedFiles,
        status: "Pending",
        submittedAt: new Date(),
      });
    } else {
      portfolio.data = mergedData;
      portfolio.files = mergedFiles;
      portfolio.status = "Pending";
      portfolio.submittedAt = new Date();
    }

    await portfolio.save();

    const io = req.app.get("io");
    io?.emit("portfolio_update", {
      event: "submitted",
      studentId,
      portfolioId: portfolio._id,
      status: portfolio.status,
      submittedAt: portfolio.submittedAt,
    });

    res.json({ message: "Portfolio submitted successfully ✅", portfolio });
  } catch (err) {
    console.error("Portfolio submit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------
// Approve Portfolio (Faculty/Admin)
// -------------------------
router.post("/approve", async (req, res) => {
  try {
    const { studentId, remark } = req.body;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const portfolio = await StudentData.findOne({
      studentId: studentObjectId,
    }).populate("studentId");
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    portfolio.status = "Approved";
    portfolio.remark = remark || "";
    portfolio.approvedAt = new Date();

    portfolio.pdfUrl = await generatePortfolioPDF(portfolio);
    await portfolio.save();

    const io = req.app.get("io");
    io?.emit("portfolio_update", {
      event: "approved",
      studentId,
      portfolioId: portfolio._id,
      status: portfolio.status,
      remark: portfolio.remark,
      pdfUrl: portfolio.pdfUrl,
    });

    res.json({ message: "Portfolio approved successfully ✅", portfolio });
  } catch (err) {
    console.error("Portfolio approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------
// Reject Portfolio (Faculty/Admin)
// -------------------------
router.post("/reject", async (req, res) => {
  try {
    const { studentId, remark } = req.body;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const portfolio = await StudentData.findOne({
      studentId: studentObjectId,
    }).populate("studentId");
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    portfolio.status = "Rejected";
    portfolio.remark = remark || "";
    portfolio.rejectedAt = new Date();
    await portfolio.save();

    const io = req.app.get("io");
    io?.emit("portfolio_update", {
      event: "rejected",
      studentId,
      portfolioId: portfolio._id,
      status: portfolio.status,
      remark,
    });

    res.json({ message: "Portfolio rejected ✅", portfolio });
  } catch (err) {
    console.error("Portfolio reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------
// Get All Portfolios (Faculty/Admin)
// -------------------------
router.get("/all", async (req, res) => {
  try {
    const portfolios = await StudentData.find().populate("studentId");

    const result = await Promise.all(
      portfolios.map(async (portfolio) => {
        const sections = await StudentSection.find({
          studentId: portfolio.studentId._id,
        }).lean();
        const studentSections = {};
        sections.forEach((s) => {
          studentSections[s.sectionId] = {
            data: s.data || {},
            files: s.files || {},
          };
        });
        return { ...portfolio.toObject(), studentSections };
      })
    );

    res.json({ success: true, portfolios: result });
  } catch (err) {
    console.error("Get all portfolio error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------
// Get Portfolio Details by ID (Faculty/Admin)
// -------------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await StudentData.findById(id).populate("studentId");
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    const sections = await StudentSection.find({
      studentId: portfolio.studentId._id,
    }).lean();
    const studentSections = {};
    sections.forEach((s) => {
      studentSections[s.sectionId] = {
        data: s.data || {},
        files: s.files || {},
      };
    });

    res.json({
      success: true,
      portfolio: { ...portfolio.toObject(), studentSections },
    });
  } catch (err) {
    console.error("Get portfolio details error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------
// Get Portfolio Status (Student)
// -------------------------
router.get("/status/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const portfolio = await StudentData.findOne({ studentId: studentObjectId });
    if (!portfolio) return res.json({ status: "Not Submitted" });

    res.json({
      status: portfolio.status,
      remark: portfolio.remark || "",
      pdfUrl: portfolio.pdfUrl || null,
    });
  } catch (err) {
    console.error("Get portfolio status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
