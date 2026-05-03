const { getProjectMember } = require("../utils/projectAccess");

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const { role } = await getProjectMember(
        projectId,
        req.user._id
      );

      if (requiredRole === "admin" && role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
      }

      next();
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  };
};

module.exports = checkRole;