const Project = require("../models/project.model");
const User = require("../models/user.model");
const mailService = require("../services/mailService");
const { getProjectMember } = require("../utils/projectAccess");
const Invite = require("../models/invite.model");

exports.createProject = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const project = await Project.create({
      name,
      description,
      isPublic,
      owner: req.user._id,
      members: [],
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.inviteUser = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // prevent duplicate
    const exists = project.members.find(
      (m) => m.user.toString() === user._id.toString(),
    );

    if (exists) throw new Error("Already a member");

    await mailService.sendInviteEmail(user.email, project.name);

    project.members.push({
      user: user._id,
      role: "member",
    });

    await project.save();


    res.json({ success: true, message: "User added" });
  } catch (err) {
    // res.status(400).json({ success: false, message: err.message });
    next(err);
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { "members.user": userId }, { isPublic: true }],
    });

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // check membership + role
    const member = await getProjectMember(projectId, req.user._id);

    if (member.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete project",
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.sendInvite = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await Invite.create({
      email,
      project: projectId,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
    });

    const link = `${process.env.FRONTEND_URL}/accept-invite/${token}`;

    await sendInviteEmail(email, link);

    res.json({
      success: true,
      message: "Invite sent",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    if (invite.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invite expired" });
    }

    if (invite.status === "accepted") {
      return res.status(400).json({ message: "Already used" });
    }

    const project = await Project.findById(invite.project);

    project.members.push({
      user: req.user._id,
      role: "member",
    });

    await project.save();

    invite.status = "accepted";
    await invite.save();

    res.json({ success: true, message: "Joined project" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};