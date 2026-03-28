const mongoose = require("mongoose");

const studentPortfolioDataSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  data: { type: Object, default: {} }, // merged sections data
  files: { type: Object, default: {} }, // merged files
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  remark: { type: String, default: "" },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  pdfUrl: { type: String, default: "" },
});

module.exports = mongoose.model(
  "StudentPortfolioData",
  studentPortfolioDataSchema
);
