const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.signup(email, password);

    res.status(201).json({
      success: true,
      message: "User created",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await authService.login(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      // sameSite: "strict" 
      sameSite: "lax",
    });

    res.json({
      success: true,
      accessToken,
      user : {
        id : user._id,
        email : user.email
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};


exports.refresh = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await authService.refresh(oldToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      // sameSite: "strict" 
    });

    res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    await authService.logout(token);

    res.clearCookie("refreshToken");

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};