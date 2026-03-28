const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const puppeteer = require("puppeteer");
const StudentData = require("../models/StudentData");
const StudentSection = require("../models/StudentSection");

// Ensure uploads/pdfs folder exists
const pdfDir = path.join(__dirname, "../../uploads/pdfs");
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

/**
 * POST /api/pdf/generate
 * body: { studentId, templateId }
 */
router.post("/generate", async (req, res) => {
  try {
    const { studentId, templateId } = req.body;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }

    // Fetch final StudentData
    const studentData = await StudentData.findOne({ studentId }).lean();
    if (!studentData) {
      return res
        .status(404)
        .json({ success: false, message: "No final submission found" });
    }

    // Fetch all StudentSections
    const sections = await StudentSection.find({ studentId }).lean();
    const mergedSections = {};
    sections.forEach((s) => {
      mergedSections[s.sectionId] = {
        data: s.data || {},
        files: s.files || {},
      };
    });

    // Build normalized full data
    const fullData = {
      profile: studentData.data?.profile || {},
      education: studentData.data?.education || [],
      experience: studentData.data?.experience || [],
      skills: studentData.data?.skills || {},
      certifications: studentData.data?.certifications || [],
      training: studentData.data?.training || [],
      projects: studentData.data?.projects || [],
      socialLinks: studentData.data?.socialLinks || {},
      volunteer: studentData.data?.volunteer || [],
      additionalInfo: studentData.data?.additionalInfo || {},
      status: studentData.status || "Not Submitted",
      remark: studentData.remark || "",
      sections: mergedSections,
      files: studentData.files || {},
    };

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Select template
    let html = "";
    if (templateId === "template-2")
      html = generateTemplate2(fullData, baseUrl);
    else if (templateId === "template-3")
      html = generateTemplate3(fullData, baseUrl);
    else html = generateTemplate1(fullData, baseUrl);

    // Puppeteer PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 }); // A4-ish
    await page.setContent(html, { waitUntil: "networkidle0" });

    const fileName = `portfolio_${studentId}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
    });
    await browser.close();

    const pdfLink = `/uploads/pdfs/${fileName}`;
    await StudentData.findOneAndUpdate(
      { studentId },
      { $set: { pdfLink, updatedAt: new Date() } }
    );

    res.json({ success: true, pdfLink });
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
});

/* ----------------------
   Helpers
   ---------------------- */
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFullName(profile) {
  if (!profile) return "Student Name";
  if (profile.name) return profile.name;
  return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
}

function getPhotoUrl(baseUrl, photo) {
  if (!photo) return "";
  if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
  let p = photo.replace(/\\/g, "/");
  const idx = p.indexOf("uploads/");
  return idx !== -1 ? `${baseUrl}/${p.slice(idx)}` : `${baseUrl}/${p}`;
}

function normalizeArray(maybeArray) {
  if (!maybeArray) return [];
  if (Array.isArray(maybeArray)) return maybeArray;
  if (typeof maybeArray === "object") return [maybeArray];
  return [];
}

function renderSkills(skills) {
  if (!skills) return "";
  let list = [];
  if (typeof skills === "object") {
    list = [
      ...(skills.technicalSkills ? skills.technicalSkills.split(",") : []),
      ...(skills.programmingLanguages
        ? skills.programmingLanguages.split(",")
        : []),
      ...(skills.toolsFrameworks ? skills.toolsFrameworks.split(",") : []),
    ].map((s) => s.trim());
  }
  return list
    .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
    .join("");
}

/* ==============================
   Template 1 - Classic
   ============================== */
function generateTemplate1(d, baseUrl) {
  const name = escapeHtml(getFullName(d.profile));
  const photo = getPhotoUrl(baseUrl, d.profile.photo);
  const role = escapeHtml(d.profile.role || d.profile.designation || "");
  const education = normalizeArray(d.education);
  const experience = normalizeArray(d.experience);
  const projects = normalizeArray(d.projects);
  const skillsHtml = renderSkills(d.skills);

  return `
<!doctype html>
<html>
<head>
<style>
body { font-family: 'Poppins', sans-serif; margin:0; padding:20px; background:#fff; }
.container { max-width:800px; margin:auto; }
.header { display:flex; gap:20px; align-items:center; }
.photo { width:100px; height:100px; border-radius:8px; object-fit:cover; }
h1 { margin:0; font-size:26px; }
.role { color:#555; }
.section { margin-top:20px; }
.section h2 { font-size:18px; color:#007bff; border-bottom:1px solid #eee; }
.skill-chip { display:inline-block; padding:4px 8px; margin:4px; background:#f0f4ff; border-radius:12px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    ${photo ? `<img src="${photo}" class="photo"/>` : ""}
    <div>
      <h1>${name}</h1>
      <div class="role">${role}</div>
      <div>${d.profile.email || ""} | ${d.profile.contact || ""}</div>
    </div>
  </div>

  <div class="section"><h2>Education</h2>
    ${education.map((e) => `<div><b>${escapeHtml(e.institute)}</b> — ${escapeHtml(e.degree || "")}</div>`).join("")}
  </div>

  <div class="section"><h2>Experience</h2>
    ${experience.map((ex) => `<div><b>${escapeHtml(ex.position)}</b> at ${escapeHtml(ex.company)}</div>`).join("")}
  </div>

  <div class="section"><h2>Skills</h2>${skillsHtml}</div>

  <div class="section"><h2>Projects</h2>
    ${projects.map((p) => `<div><b>${escapeHtml(p.projectTitle)}</b> — ${escapeHtml(p.projectType || "")}</div>`).join("")}
  </div>
</div>
</body>
</html>`;
}

/* ==============================
   Template 2 - Modern Two Column
   ============================== */
function generateTemplate2(d, baseUrl) {
  const name = escapeHtml(getFullName(d.profile));
  const photo = getPhotoUrl(baseUrl, d.profile.photo);
  const skillsHtml = renderSkills(d.skills);
  const education = normalizeArray(d.education);
  const experience = normalizeArray(d.experience);

  return `
<!doctype html>
<html>
<head>
<style>
body { font-family: 'Inter', sans-serif; background:#f4f6f8; padding:20px; }
.wrapper { display:flex; max-width:900px; margin:auto; }
.sidebar { width:30%; background:#2c3e50; color:#fff; padding:20px; }
.main { width:70%; background:#fff; padding:20px; }
.photo { width:100px; height:100px; border-radius:50%; margin:auto; display:block; }
h1 { text-align:center; }
.section h2 { border-bottom:1px solid #ddd; }
.skill-chip { background:#fff; color:#2c3e50; margin:4px; padding:4px 6px; border-radius:6px; display:inline-block; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="sidebar">
    ${photo ? `<img src="${photo}" class="photo"/>` : ""}
    <h1>${name}</h1>
    <p>${d.profile.email || ""}</p>
    <p>${d.profile.contact || ""}</p>
    <h2>Skills</h2>${skillsHtml}
  </div>
  <div class="main">
    <div class="section"><h2>Experience</h2>
      ${experience.map((ex) => `<div><b>${escapeHtml(ex.position)}</b> — ${escapeHtml(ex.company)}</div>`).join("")}
    </div>
    <div class="section"><h2>Education</h2>
      ${education.map((e) => `<div><b>${escapeHtml(e.institute)}</b> — ${escapeHtml(e.degree || "")}</div>`).join("")}
    </div>
  </div>
</div>
</body>
</html>`;
}

/* ==============================
   Template 3 - Stylish Colorful
   ============================== */
function generateTemplate3(d, baseUrl) {
  const name = escapeHtml(getFullName(d.profile));
  const photo = getPhotoUrl(baseUrl, d.profile.photo);
  const education = normalizeArray(d.education);
  const experience = normalizeArray(d.experience);
  const skillsHtml = renderSkills(d.skills);

  return `
<!doctype html>
<html>
<head>
<style>
body { font-family: 'Poppins', sans-serif; background:#eef2f7; padding:20px; }
.container { max-width:900px; margin:auto; background:#fff; padding:20px; border-radius:12px; }
.header { display:flex; align-items:center; }
.photo { width:100px; height:100px; border-radius:8px; border:3px solid #1a73e8; margin-right:20px; }
.title { color:#1a73e8; font-size:24px; font-weight:bold; }
.section { margin-top:20px; }
.section h2 { background:#1a73e8; color:#fff; padding:6px; border-radius:6px; }
.skill-chip { background:#1a73e8; color:#fff; padding:4px 8px; margin:4px; border-radius:12px; display:inline-block; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    ${photo ? `<img src="${photo}" class="photo"/>` : ""}
    <div>
      <div class="title">${name}</div>
      <div>${d.profile.email || ""} | ${d.profile.contact || ""}</div>
    </div>
  </div>

  <div class="section"><h2>Experience</h2>
    ${experience.map((ex) => `<div><b>${escapeHtml(ex.position)}</b> — ${escapeHtml(ex.company)}</div>`).join("")}
  </div>

  <div class="section"><h2>Education</h2>
    ${education.map((e) => `<div><b>${escapeHtml(e.institute)}</b> — ${escapeHtml(e.degree || "")}</div>`).join("")}
  </div>

  <div class="section"><h2>Skills</h2>${skillsHtml}</div>
</div>
</body>
</html>`;
}

module.exports = router;
