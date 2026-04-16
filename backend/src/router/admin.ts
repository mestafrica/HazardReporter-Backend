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
import { uploadAnnouncementFiles } from "../middlewares/cloudinaryUpload";
import { checkAdmin, extractJWT } from "../middlewares/extractJWT";

const router = express.Router();

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
router.post("/admin/signin", adminController.adminSignin);

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/admin/logout", checkAuth, adminController.adminLogout);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Get all hazard reports (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all hazard reports
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/admin/reports",
  checkAuth,
  hasPermission("view_reports"),
  hazardReportController.getAllHazardReports,
);

/**
 * @swagger
 * /admin/reports/stats:
 *   get:
 *     summary: Get hazard report statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hazard report statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/admin/reports/stats",
  checkAuth,
  hasPermission("view_reports"),
  hazardReportController.getHazardReportStats,
);

/**
 * @swagger
 * /admin/reports/{id}/status:
 *   patch:
 *     summary: Update hazard report status (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in progress, resolved]
 *     responses:
 *       200:
 *         description: Report status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.patch(
  "/admin/reports/:id/status",
  checkAuth,
  hasPermission("update_report_status"),
  hazardReportController.updateReportStatus,
);

/**
 * @swagger
 * /admin/announcements:
 *   post:
 *     summary: Create announcement (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *               category:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Announcement created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.post(
  "/admin/announcements",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles.array("attachments", 5),
  createAnnouncement,
);

/**
 * @swagger
 * /admin/announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of announcements
 */
router.get("/admin/announcements", getAllAnnouncements);

/**
 * @swagger
 * /admin/announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement found
 *       404:
 *         description: Announcement not found
 */
router.get("/admin/announcements/:id", getAnnouncementById);

/**
 * @swagger
 * /admin/announcements/{id}:
 *   patch:
 *     summary: Update announcement (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.patch(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  uploadAnnouncementFiles.array("attachments", 5),
  updateAnnouncement,
);

/**
 * @swagger
 * /admin/announcements/{id}:
 *   delete:
 *     summary: Delete announcement (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.delete(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  deleteAnnouncement,
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/admin/users",
  checkAuth,
  hasPermission("read_users"),
  adminController.getAllUsers,
);

export default router;
