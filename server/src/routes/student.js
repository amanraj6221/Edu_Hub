const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const StudentSection = require("../models/StudentSection");
const StudentData = require("../models/StudentData");

const router = express.Router();

// ------------------ Ensure Uploads Folder ------------------
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // replace spaces with underscores for safe filenames
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});
const upload = multer({ storage });

// ------------------ POST: Save Section Data ------------------
router.post("/section/save", upload.any(), async (req, res) => {
  try {
    const { studentId, sectionId, data } = req.body;

    if (!studentId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "studentId & sectionId are required",
      });
    }

    // Parse section data
    let parsedData = {};
    try {
      parsedData = data ? JSON.parse(data) : {};
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON in data field" });
    }

    // Validate studentId
    let studentObjectId;
    try {
      studentObjectId = new mongoose.Types.ObjectId(studentId);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });
    }

    // ✅ Store only relative paths
    const files = {};
    if (req.files) {
      req.files.forEach((file) => {
        files[file.fieldname] = `/uploads/${file.filename}`;
      });
    }

    const section = await StudentSection.findOneAndUpdate(
      { studentId: studentObjectId, sectionId },
      { data: parsedData, files, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    return res.json({ success: true, message: "Draft saved ✅", section });
  } catch (err) {
    console.error("❌ Save draft error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ GET: Fetch Section Data ------------------
router.get("/section/:sectionId/:studentId", async (req, res) => {
  try {
    const { sectionId, studentId } = req.params;

    let studentObjectId;
    try {
      studentObjectId = new mongoose.Types.ObjectId(studentId);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });
    }

    const section = await StudentSection.findOne({
      studentId: studentObjectId,
      sectionId,
    });

    if (!section) {
      return res.json({
        success: true,
        data: null,
        files: {},
        message: "No data found",
      });
    }

    return res.json({
      success: true,
      data: section.data,
      files: section.files || {},
    });
  } catch (err) {
    console.error("❌ Fetch section error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ POST: Final Submit ------------------
router.post("/submit", async (req, res) => {
  try {
    const { studentId, sections } = req.body;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }

    let studentObjectId;
    try {
      studentObjectId = new mongoose.Types.ObjectId(studentId);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });
    }

    // Required sections
    const requiredSections = [
      "profile",
      "education",
      "experience",
      "skills",
      "certifications",
      "training",
      "projects",
      "socialLinks",
      "volunteer",
      "additionalInfo",
    ];

    // Fetch all sections for this student
    const dbSections = await StudentSection.find({
      studentId: studentObjectId,
    });

    // Check incomplete sections
    const completedSections = dbSections.map((s) => s.sectionId);
    const incompleteSections = requiredSections.filter(
      (s) => !completedSections.includes(s)
    );

    if (incompleteSections.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot submit. Complete these sections first: ${incompleteSections.join(
          ", "
        )}`,
      });
    }

    // Merge all section data (frontend + DB fallback)
    const mergedData = {};
    const mergedFiles = {};
    requiredSections.forEach((sec) => {
      const dbSec = dbSections.find((s) => s.sectionId === sec);
      const frontSec = sections ? sections[sec] : null;

      mergedData[sec] = frontSec?.data || dbSec?.data || {};
      mergedFiles[sec] = frontSec?.files || dbSec?.files || {};
    });

    // Upsert into StudentData
    const studentData = await StudentData.findOneAndUpdate(
      { studentId: studentObjectId },
      {
        studentId: studentObjectId,
        data: mergedData,
        files: mergedFiles,
        status: "Pending",
        submittedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Application submitted successfully ✅",
      studentData,
    });
  } catch (err) {
    console.error("❌ Final submit error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
