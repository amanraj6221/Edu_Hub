// C:\Users\Aman Raj\EducationHub\EducationHub\server\server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// ------------------ Setup ------------------
dotenv.config();
const app = express();

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------ Middleware ------------------
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:8080",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ------------------ Static Uploads ------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ Routes ------------------
import authRoutes from "./src/routes/auth.js";
import facultyRoutes from "./src/routes/faculty.js";
import studentRoutes from "./src/routes/student.js";
import portfolioRoutes from "./src/routes/portfolio.js";
import pdfRoutes from "./src/routes/pdf.js";
import adminRoutes from "./src/routes/adminAuth.js"; // ✅ fixed filename

app.use("/api/pdf", pdfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admin", adminRoutes); // ✅ Admin APIs

// ------------------ Server & Socket.io ------------------
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ------------------ MongoDB Connection ------------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/educationhub";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ------------------ Default ------------------
app.get("/", (req, res) => {
  res.send("EducationHub Backend is running ✅");
});
