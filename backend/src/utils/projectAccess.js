const Project = require("../models/project.model");

const getProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) throw new Error("Project not found");

  // owner is always admin
  if (project.owner.toString() === userId.toString()) {
    return { role: "admin", project };
  }

  const member = project.members.find(
    (m) => m.user.toString() === userId.toString()
  );

  if (!member) throw new Error("Not part of project");

  return { role: member.role, project };
};

module.exports = { getProjectMember };