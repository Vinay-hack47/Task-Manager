const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboard,
} = require("../controllers/task.controller");

router.post("/:projectId/create", auth, createTask);
router.get("/:projectId", auth, getTasks);

router.patch("/:taskId/update", auth, updateTask);
router.delete("/:taskId", auth, deleteTask);

router.get("/:projectId/dashboard", auth, getDashboard);

module.exports = router;