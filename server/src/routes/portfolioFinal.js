// C:\Users\Aman Raj\EducationHub\EducationHub\server\src\routes\portfolioFinal.js
const express = require("express");
const router = express.Router();

const StudentSection = require("../models/StudentSection");
const StudentPortfolio = require("../models/StudentPortfolio");

// 🚀 Final Submit
router.post("/submit", async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID required" });
    }

    const sections = await StudentSection.find({ studentId }).lean();

    if (!sections || sections.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No section data found" });
    }

    const mergedData = {};
    const files = {};

    sections.forEach((s) => {
      mergedData[s.sectionId] = s.data || {};
      if (s.files) {
        Object.keys(s.files).forEach((key) => {
          files[`${s.sectionId}_${key}`] = s.files[key];
        });
      }
    });

    const portfolio = await StudentPortfolio.findOneAndUpdate(
      { studentId },
      {
        studentId,
        data: mergedData,
        files,
        status: "Pending",
        submittedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, portfolio });
  } catch (err) {
    console.error("Final Submit error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
