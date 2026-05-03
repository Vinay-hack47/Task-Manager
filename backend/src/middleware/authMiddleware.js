const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken.model");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Professional Check: Kya is user ka koi active session (Refresh Token) DB mein hai?
    const activeSession = await RefreshToken.findOne({ user: decoded._id });
    if (!activeSession) {
        return res.status(401).json({ message: "Session expired, please login again" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};