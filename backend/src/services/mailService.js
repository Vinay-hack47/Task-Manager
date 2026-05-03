const transporter = require("../utils/mail");

exports.sendInviteEmail = async (to, projectName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Project Invitation",
    text: `You have been added to project: ${projectName}`,
  });
};

exports.sendTaskAssignedEmail = async (to, taskTitle) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Task Assigned",
    text: `You have been assigned a task: ${taskTitle}`,
  });
};