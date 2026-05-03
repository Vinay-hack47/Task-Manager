const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/response");

exports.signup = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
  });

  return user;
};

exports.login = async (email, password) => {
  // 1. User check karein
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  // 2. Password match karein
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // 3. Tokens generate karein
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // 4. OLD TOKENS DELETE (Crucial Step)
  // Isse purane saare sessions delete ho jayenge aur DB clean rahega
  await RefreshToken.deleteMany({ user: user._id });

  // 5. Naya Refresh Token save karein
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};


exports.refresh = async (oldToken) => {
  if (!oldToken) throw new Error("No refresh token");

  const existing = await RefreshToken.findOne({ token: oldToken });

  if (!existing) throw new Error("Invalid refresh token");

  if (existing.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: existing._id });
    throw new Error("Token expired");
  }

  // ROTATION (important)
  await RefreshToken.deleteOne({ _id: existing._id });

  const newRefreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: existing.user,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = generateAccessToken({ _id: existing.user });

  return { accessToken, refreshToken: newRefreshToken };
};


exports.logout = async (token) => {
  if (!token) return;

  await RefreshToken.deleteOne({ token });
};