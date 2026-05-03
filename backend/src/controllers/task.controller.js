const Task = require("../models/task.model");
const User = require("../models/user.model");
const { getProjectMember } = require("../utils/projectAccess");
const mailService = require("../services/mailService");

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, deadline, priority, assignedTo } = req.body;

    // check membership
    await getProjectMember(projectId, req.user._id);

    // validate assigned user
    if (assignedTo) {
      await getProjectMember(projectId, assignedTo);
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      assignedTo,
      project: projectId,
      createdBy: req.user._id,
    });

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      await mailService.sendTaskAssignedEmail(assignedUser.email, title);
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    await getProjectMember(projectId, req.user._id);

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "email")
      .populate("createdBy", "email");

    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    await getProjectMember(task.project, req.user._id);

    // prevent random assignment
    if (updates.assignedTo) {
      await getProjectMember(task.project, updates.assignedTo);
    }

    Object.assign(task, updates);

    await task.save();

    if (updates.assignedTo) {
      const user = await User.findById(updates.assignedTo);
      await sendTaskAssignedEmail(user.email, task.title);
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    const { role } = await getProjectMember(task.project, req.user._id);

    if (role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    await Task.deleteOne({ _id: taskId });

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;

    await getProjectMember(projectId, req.user._id);

    const now = new Date();

    const tasks = await Task.find({ project: projectId });

    const stats = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      if (task.status === "DONE") stats.completed++;
      else stats.pending++;

      if (task.deadline && task.deadline < now && task.status !== "DONE") {
        stats.overdue++;
      }
    });

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};
