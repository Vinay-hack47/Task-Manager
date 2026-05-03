const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth.route");
const projectRoutes = require("./src/routes/project.route");
const taskRoutes = require("./src/routes/task.route");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const errorMiddleware = require("./src/middleware/errorMiddleware");
const logger = require("./src/utils/logger")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,// frontend URL
    credentials: true, // cookies allow
  })
);

// Send data from morgan to wiston
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try later",
});

app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);



process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION:", err.message);
});

app.use(errorMiddleware);

module.exports = app;