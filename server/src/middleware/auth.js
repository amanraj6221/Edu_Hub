// C:\Aman Raj\EduSangrah\server\src\middleware\auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded; // { id, role, username }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, msg: "Invalid token" });
  }
};
