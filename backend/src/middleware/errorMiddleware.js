const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  // 1. Status Code set karein (Controller se aaya toh thik, nahi toh 500)
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 2. Winston Logger ko error send
  // Hum pura 'err' object bhej rahe hain taaki 'stack trace' log ho jaye
  logger.error({
    method: req.method,
    url: req.url,
    status: statusCode,
    message: message,
    stack: err.stack, 
  });

  // 3. User ko response bhejein
  res.status(statusCode).json({
    success: false,
    message: message,
    // Development mein stack trace dikhao, production mein nahi (Security!)
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
