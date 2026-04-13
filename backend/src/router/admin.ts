import express from "express";
import adminController from "../controllers/admin";
import adminController from "../controllers/admin";
import hazardReportController from "../controllers/hazardreport";
import { checkAuth, hasPermission } from "../middlewares/auth";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";
import {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} from "../controllers/announcement";
import { uploadAnnouncementFiles } from "../middlewares/cloudinaryUpload";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";
import {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} from "../controllers/announcement";
import { uploadAnnouncementFiles } from "../middlewares/cloudinaryUpload";

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
    hazardReportController.getAllHazardReports
    "/admin/reports",
    checkAuth,
    hasPermission("view_reports"),
    hazardReportController.getAllHazardReports
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
    hazardReportController.getHazardReportStats
);
router.patch(
    "/admin/reports/:id/status",
    checkAuth,
    hasPermission("update_report_status"),
    hazardReportController.updateReportStatus
);

// ─── Announcement Routes (protected) ──────────────────────────────────────────
router.post(
    "/admin/announcements",
    extractJWT,
    checkAdmin,
    uploadAnnouncementFiles.array("attachments", 5),
    createAnnouncement
);
router.get("/admin/announcements", getAllAnnouncements);
router.get("/admin/announcements/:id", getAnnouncementById);
router.patch(
    "/admin/announcements/:id",
    extractJWT,
    checkAdmin,
    uploadAnnouncementFiles.array("attachments", 5),
    updateAnnouncement
);
router.delete(
    "/admin/announcements/:id",
    extractJWT,
    checkAdmin,
    deleteAnnouncement
);

router.get(
    "/admin/users",
    checkAuth,
    hasPermission("read_users"),
    adminController.getAllUsers
);



export default router;