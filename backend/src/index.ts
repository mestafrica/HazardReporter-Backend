import bodyParser from "body-parser";
import * as compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";
import logging from "./config/logging";
import { getSwaggerSpec } from "./config/swagger";
import adminRoutes from "./router/admin";
import announcementRoutes from "./router/announcement";
import hazardReport from "./router/hazardreport";
import hazardRoutes from "./router/hazardtypes";
import healthRoutes from "./router/health";
import resetPasswordRoutes from "./router/resetpassword";
import userRoutes from "./router/user";
dotenv.config();

const NAMESPACE = "Server";
const app = express();

// Connecting to mongodb
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(() => {
    logging.info(NAMESPACE, "Connected to Database");
  })
  .catch((error) => {
    logging.error(NAMESPACE, "Database connection error", error);
  });

// Log the request
app.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
  );

  res.on("finish", () => {
    //Log the response
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`,
    );
  });

  next();
});

//security middleware - CORS configuration for multiple frontends
const allowedOrigins = new Set(process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173', 'http://localhost:5174']);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow configured origins - O(1) lookup with Set
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Compression middleware - reduces response payload size
app.use(compression());

//Parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Swagger documentation - serve dynamic spec based on request host
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(getSwaggerSpec(req));
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: "/api-docs.json",
    validatorUrl: null,
    persistAuthorization: true
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "HazardWatch API"
}));

// Root route - redirect to Swagger docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Use Route
app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/admin/hazard", hazardRoutes);
app.use("/hazard", hazardReport);
app.use("/api", resetPasswordRoutes);
app.use("/announcement", announcementRoutes);

// Error handling for not found routes
app.use((req, res) => {
  const error = new Error("Not found");
  res.status(404).json({
    message: error.message,
  });
});

// Error handling middleware - MUST be registered BEFORE starting server
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logging.error(NAMESPACE, error.message, error);
  return res.status(500).json({
    message: error.message,
  });
});

// Listen for incoming requests
const port = Number(config.server.port) || 1337;

const startServer = (currentPort: number) => {
  const server = app.listen(currentPort, () => {
    console.log(`App listening on port ${currentPort}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${currentPort} is already in use. Trying port ${currentPort + 1}...`,
      );
      startServer(currentPort + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(port);

export default app;
