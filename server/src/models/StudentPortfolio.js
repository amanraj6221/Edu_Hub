// C:\Users\Aman Raj\EducationHub\EducationHub\server\src\models\StudentPortfolio.js
const mongoose = require("mongoose");

const studentPortfolioSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  data: { type: Object, default: {} }, // merged sections data
  files: { type: Object, default: {} }, // merged uploaded files
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  submittedAt: { type: Date, default: Date.now },
  remark: { type: String },
  pdfLink: { type: String },
});

module.exports = mongoose.model("StudentPortfolio", studentPortfolioSchema);
