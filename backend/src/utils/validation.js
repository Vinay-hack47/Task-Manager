const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  priority: Joi.string().valid("Low", "Medium", "High"),
});



// Use in controller

// const { signupSchema } = require("../utils/validation");

// const { error } = signupSchema.validate(req.body);

// if (error) {
//   return res.status(400).json({
//     success: false,
//     message: error.details[0].message,
//   });
// }