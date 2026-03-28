// C: EducationHub\server\src\config\db.js
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

module.exports = async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
