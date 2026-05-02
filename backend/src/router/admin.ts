import express from "express";
import adminController from "../controllers/admin";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
} from "../controllers/announcement";
import hazardReportController from "../controllers/hazardreport";
import { checkAuth, hasPermission } from "../middlewares/auth";
import { checkAdmin, extractJWT } from "../middlewares/extractJWT";
import { uploadAnnouncementFiles } from "../middlewares/upload";

const router = express.Router();

// ─── Admin Auth Routes (public) ───────────────────────────────────────────────
router.post("/admin/signup", adminController.adminSignup);
router.post("/admin/signin", adminController.adminSignin);
router.post("/admin/logout", checkAuth, adminController.adminLogout);

// ─── Report Routes (protected) ────────────────────────────────────────────────
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
router.patch(
  "/admin/reports/:id/status",
  checkAuth,
  hasPermission("update_report_status"),
  hazardReportController.updateReportStatus,
);

// ─── Content Moderation Routes (protected) ────────────────────────────────────
router.patch(
  "/admin/reports/:id/status",
  checkAuth,
  hasPermission("update_report_status"),
  hazardReportController.updateReportStatus,
);
router.delete(
  "/admin/reports/:id",
  checkAuth,
  hasPermission("delete_reports"),
  hazardReportController.deleteReportByAdmin,
);

// ─── Announcement Routes (protected) ──────────────────────────────────────────
router.post(
  "/admin/announcements",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles,
  createAnnouncement,
);
router.get("/admin/announcements", getAllAnnouncements);
router.get("/admin/announcements/:id", getAnnouncementById);
router.patch(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles,
  updateAnnouncement,
);
router.delete(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  deleteAnnouncement,
);

// ─── User Routes (protected) ──────────────────────────────────────────────────
router.get(
  "/admin/users",
  checkAuth,
  hasPermission("read_users"),
  adminController.getAllUsers,
);

export default router;
