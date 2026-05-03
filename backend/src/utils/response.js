const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = () => {
  return require("crypto").randomBytes(40).toString("hex");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};