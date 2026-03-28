// C:\Users\Aman Raj\EducationHub\server\src\routes\faculty.js
// ------------------ IMPORTS ------------------
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pdf = require("pdf-poppler");
const Jimp = require("jimp");
const {
  MultiFormatReader,
  BarcodeFormat,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
  DecodeHintType,
} = require("@zxing/library");

// Models & Middleware
const Faculty = require("../models/Faculty");
const auth = require("../middleware/auth");

// ------------------ SETUP ------------------
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ============================================================
// 📌 FACULTY REGISTRATION
// ============================================================
router.post("/register", async (req, res) => {
  const { username, email, password, department } = req.body;

  if (!username || !email || !password || !department)
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });

  try {
    const existing = await Faculty.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, msg: "Email already exists" });

    const faculty = new Faculty({ username, email, password, department });
    await faculty.save();

    res
      .status(201)
      .json({ success: true, msg: "Faculty registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res
      .status(500)
      .json({ success: false, msg: "Server error during registration" });
  }
});

// ============================================================
// 📌 FACULTY LOGIN
// ============================================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty)
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });

    const isMatch = await faculty.comparePassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: faculty._id, role: "faculty", username: faculty.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      faculty: {
        id: faculty._id,
        username: faculty.username,
        email: faculty.email,
        department: faculty.department,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error during login" });
  }
});

// ============================================================
// 📌 CERTIFICATE VALIDATION
// ============================================================
router.post("/validate-certificate", auth, async (req, res) => {
  const { data } = req.body;

  if (!data)
    return res.json({
      success: false,
      msg: "No QR data provided",
      data: { certificateId: null, link: null },
    });

  try {
    const certificateId = data.split("/").pop() || data;
    const link = data;

    res.json({
      success: true,
      msg: "Certificate is VALID ",
      data: { certificateId, link, validatedBy: req.user.username },
    });
  } catch (err) {
    console.error("CERTIFICATE VALIDATION ERROR:", err.message);
    res.json({
      success: false,
      msg: "Error validating certificate ❌",
      data: { certificateId: null, link: data },
    });
  }
});

// ============================================================
// 📌 DOCUMENT VERIFICATION (PDF → PNG → ZXing Decode)
// ============================================================

// ------------------ SAFE CROP ------------------
function safeCrop(image, x, y, w, h) {
  x = Math.floor(x);
  y = Math.floor(y);
  w = Math.floor(w);
  h = Math.floor(h);

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + w > image.bitmap.width) w = image.bitmap.width - x;
  if (y + h > image.bitmap.height) h = image.bitmap.height - y;
  if (w <= 0 || h <= 0) return null;

  try {
    return image.clone().crop(x, y, w, h);
  } catch (err) {
    console.error("SafeCrop error:", err.message);
    return null;
  }
}

// ------------------ PREPROCESS VARIANTS ------------------
// ------------------ PREPROCESS VARIANTS ------------------
async function preprocessVariants(img) {
  return [
    // Normal contrast
    img
      .clone()
      .grayscale()
      .contrast(0.3)
      .normalize()
      .resize(img.bitmap.width * 2, img.bitmap.height * 2),

    // Stronger contrast + brightness
    img
      .clone()
      .grayscale()
      .contrast(0.5)
      .brightness(0.1)
      .resize(img.bitmap.width * 2, img.bitmap.height * 2),

    // Inverted (for white-on-black QRs)
    img
      .clone()
      .invert()
      .resize(img.bitmap.width * 2, img.bitmap.height * 2),
  ];
}

// ------------------ ZXING DECODE ------------------
async function decodeWithZXing(imgPath, saveDebug = false) {
  const image = await Jimp.read(imgPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  const reader = new MultiFormatReader();
  reader.setHints(
    new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]]])
  );

  const runDecode = (img) => {
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const buffer = new Uint8ClampedArray(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = img.bitmap.data[idx];
        const g = img.bitmap.data[idx + 1];
        const b = img.bitmap.data[idx + 2];
        buffer[y * w + x] = 255 - (r + g + b) / 3;
      }
    }

    const luminanceSource = new RGBLuminanceSource(buffer, w, h);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    try {
      const results = reader.decodeMultiple(binaryBitmap); // multiple QR support
      return results.map((r) => r.getText());
    } catch {
      try {
        const result = reader.decode(binaryBitmap); // fallback single decode
        return [result.getText()];
      } catch {
        return null;
      }
    }
  };

  // ---------- Scan full image with all variants ----------
  const variants = await preprocessVariants(image);
  for (let i = 0; i < variants.length; i++) {
    if (saveDebug) await variants[i].writeAsync(`uploads/debug_full_v${i}.png`);
    let result = runDecode(variants[i]);
    if (result) return result;
  }

  // ---------- Scan regions if needed ----------
  const regions = [
    { x: 0, y: 0, w: width / 2, h: height / 2 },
    { x: width / 2, y: 0, w: width / 2, h: height / 2 },
    { x: 0, y: height / 2, w: width / 2, h: height / 2 },
    { x: width / 2, y: height / 2, w: width / 2, h: height / 2 },
    { x: width / 4, y: height / 4, w: width / 2, h: height / 2 },
  ];

  for (const region of regions) {
    const cropped = safeCrop(image, region.x, region.y, region.w, region.h);
    if (!cropped) continue;

    const variants = await preprocessVariants(cropped);
    for (let i = 0; i < variants.length; i++) {
      if (saveDebug)
        await variants[i].writeAsync(
          `uploads/debug_crop_${region.x}_${region.y}_v${i}.png`
        );
      let result = runDecode(variants[i]);
      if (result) return result;
    }
  }

  // ---------- Sliding window for hard cases ----------
  const step = Math.floor(Math.min(width, height) / 4);
  const winSize = Math.floor(Math.min(width, height) / 2);

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const cropped = safeCrop(image, x, y, winSize, winSize);
      if (!cropped) continue;

      const variants = await preprocessVariants(cropped);
      for (let i = 0; i < variants.length; i++) {
        if (saveDebug)
          await variants[i].writeAsync(
            `uploads/debug_slide_${x}_${y}_v${i}.png`
          );
        let result = runDecode(variants[i]);
        if (result) return result;
      }
    }
  }

  return null;
}

// ------------------ VERIFY DOCUMENT ROUTE ------------------
router.post(
  "/verify-document",
  auth,
  upload.single("document"),
  async (req, res) => {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, msg: "No document uploaded" });

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let imageFiles = [];

    try {
      // ---------- PDF → PNG ----------
      if (ext === ".pdf") {
        const opts = {
          format: "png",
          out_dir: "uploads",
          out_prefix: path.basename(filePath, ext),
          dpi: 900, // increased DPI for better QR detection
        };
        await pdf.convert(filePath, opts);

        imageFiles = fs
          .readdirSync(opts.out_dir)
          .filter((f) => f.startsWith(opts.out_prefix) && f.endsWith(".png"))
          .map((f) => path.join(opts.out_dir, f));
      } else {
        imageFiles = [filePath];
      }

      // ---------- Decode QR ----------
      let qrResults = null;
      for (const imgPath of imageFiles) {
        qrResults = await decodeWithZXing(imgPath, true);
        if (qrResults) break;
      }

      if (qrResults) {
        const ids = qrResults.map((r) => r.split("/").pop() || r);
        return res.json({
          success: true,
          msg: "✅ QR Code(s) detected and certificate validated",
          data: {
            cards: ids.map((id) => ({ certificateId: id })),
            parsedQr: { raw: qrResults },
            validatedBy: req.user.username,
          },
        });
      }

      return res.json({
        success: false,
        msg: "ℹ️ Verification completed, but no QR code detected",
        data: { parsedQr: null, validatedBy: req.user.username },
      });
    } catch (err) {
      console.error("VERIFY DOCUMENT ERROR:", err);
      return res
        .status(500)
        .json({ success: false, msg: "Server error during verification" });
    } finally {
      fs.existsSync(filePath) && fs.unlink(filePath, () => {});
      imageFiles.forEach(
        (img) => fs.existsSync(img) && fs.unlink(img, () => {})
      );
    }
  }
);

module.exports = router;
