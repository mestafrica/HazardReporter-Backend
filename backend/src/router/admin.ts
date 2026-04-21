import express from "express";
import adminController from "../controllers/admin";
<<<<<<< HEAD
import  hazardReportController from "../controllers/hazardreport";
import { checkAuth, hasPermission } from "../middlewares/auth";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
=======
import {
    createAnnouncement,
    deleteAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
>>>>>>> 50a48e8e26852eef2f8988b343ccdf0c495bdbef
} from "../controllers/announcement";
import hazardReportController from "../controllers/hazardreport";
import { checkAuth, hasPermission } from "../middlewares/auth";
import { uploadAnnouncementFiles } from "../middlewares/cloudinaryUpload";
import { checkAdmin, extractJWT } from "../middlewares/extractJWT";

const router = express.Router();

<<<<<<< HEAD
// ─── Admin Auth Routes (public) ───────────────────────────────────────────────
router.post("/admin/signup", adminController.adminSignup);
=======
/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Admin sign up
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *             properties:
 *               userName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *              confirmPassword:
 *                type: string
 *     responses:
 *       201:
 *         description: Admin signup successful
 *       400:
 *         description: Invalid input
 */
router.post("/admin/signup", adminController.adminSignup);

/**
 * @swagger
 * /admin/signin:
 *   post:
 *     summary: Admin sign in
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin signin successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
>>>>>>> 50a48e8e26852eef2f8988b343ccdf0c495bdbef
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

// ─── Announcement Routes (protected) ──────────────────────────────────────────
router.post(
  "/admin/announcements",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles.array("attachments", 5),
  createAnnouncement,
);
router.get("/admin/announcements", getAllAnnouncements);
router.get("/admin/announcements/:id", getAnnouncementById);
router.patch(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles.array("attachments", 5),
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
