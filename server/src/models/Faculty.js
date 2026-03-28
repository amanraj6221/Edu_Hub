// C:\Aman Raj\EduSangrah\server\src\models\Faculty.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FacultySchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
FacultySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
FacultySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Faculty", FacultySchema);
