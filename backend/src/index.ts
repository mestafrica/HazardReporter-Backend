import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import logging from "./config/logging";
import config from "./config/config";
import userRoutes from "./router/user";
import adminRoutes from "./router/admin";
import resetPasswordRoutes from "./router/resetpassword";
import hazardRoutes from "./router/hazardtypes";
import hazardReport from "./router/hazardreport";
import cors from "cors";
import "express-async-errors";

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

//security middleware
app.use(cors());

//Parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rules of the API
app.use((req, res, next) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  // Pass to next middleware or route handler
  next();
});

// Use Route

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/hazard", hazardRoutes);
app.use("/hazard-report", hazardReport);
app.use("/api", resetPasswordRoutes);
app.use("/announcement", announcementRoutes);

// Error handling for not found routes
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status(404).json({
    message: error.message,
  });
});

// const httpServer = http.createServer(router);

// httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));

// Listen for incoming requests
let port = Number(config.server.port) || 1337;

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

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logging.error(NAMESPACE, error.message, error);
  return res.status(500).json({
    message: error.message,
  });
});
