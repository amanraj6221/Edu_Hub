// server/src/models/StudentData.js
const mongoose = require("mongoose");

const studentDataSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    data: {
      type: Object,
      default: {},
    },

    files: {
      type: Object,
      default: {},
    },

    // Faculty/Admin status
    status: {
      type: String,
      enum: [
        "Not Submitted",
        "Pending",
        "ForwardedToAdmin",
        "Approved",
        "Rejected",
        "Ready", // ✅ Added for admin final approval
      ],
      default: "Not Submitted",
    },

    remark: {
      type: String,
      default: "",
    },

    submittedAt: { type: Date },
    facultyApprovedAt: { type: Date },
    adminApprovedAt: { type: Date },
    rejectedAt: { type: Date },
    adminRejectedAt: { type: Date },
  },
  { timestamps: true }
);

// Optional: pre-save hook to update timestamps automatically
studentDataSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "Approved")
      this.facultyApprovedAt = this.facultyApprovedAt || new Date();
    if (this.status === "Rejected")
      this.rejectedAt = this.rejectedAt || new Date();
    if (this.status === "ForwardedToAdmin")
      this.facultyApprovedAt = this.facultyApprovedAt || new Date();
    if (this.status === "Ready")
      this.adminApprovedAt = this.adminApprovedAt || new Date();
  }
  next();
});

module.exports = mongoose.model("StudentData", studentDataSchema);
