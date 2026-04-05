import express from "express";
import controller from "../controllers/user";
import hazardReportController from "../controllers/hazardreport";
import { checkAuth, hasPermission } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = express.Router();

// Admin auth routes
router.post("/admin/signup", upload.single('avatar'), controller.adminSignup);
router.post("/admin/signin", controller.adminSignin);

// Admin protected routes
router.get(
  "/admin/reports",
  checkAuth,
  hasPermission("view_reports"),
  hazardReportController.getAllHazardReports,
);
router.get(
  "/admin/reports/stats",
  checkAuth,
  hasPermission("view_reports"),
  hazardReportController.getHazardReportStats,
);

// Admin profile routes
router.get("/admin/profile", checkAuth, controller.getAdminProfile);
router.patch(
  "/admin/profile",
  checkAuth,
  upload.single("avatar"),
  controller.updateAdminProfile,
);

export default router;
