const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  createProject,
  inviteUser,
  getProjects,
  deleteProject,
  sendInvite,
  acceptInvite,
} = require("../controllers/project.controller");

router.post("/createProject", auth, createProject);
router.get("/getProject", auth, getProjects);

router.post(
  "/:projectId/invite",
  auth,
  checkRole("admin"),
  inviteUser
);

router.delete("/:projectId", auth, deleteProject);

router.post("/:projectId/invite", auth, sendInvite);
router.post("/accept-invite/:token", auth, acceptInvite);

module.exports = router;