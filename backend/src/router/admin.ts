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
import upload from "../middlewares/upload";
import { uploadAvatar } from "../middlewares/cloudinaryUpload";
import User from "../models/user";

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Admin signup successful
 *       400:
 *         description: Invalid input
 */
router.post("/admin/signup", uploadAvatar.single('avatar'), adminController.adminSignup);

/**
 * @swagger
 * /admin/signin:
 *   post:
 *     summary: Admin sign in
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
router.post("/admin/signin", upload.none(), adminController.adminSignin);

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
 * /admin/profile:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/admin/profile", extractJWT, checkAdmin, (req: any, res: any) => {
    // req.user is set by extractJWT middleware
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        avatar: req.user.avatar,
    });
});

/**
 * @swagger
 * /admin/profile:
 *   patch:
 *     summary: Update admin profile
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
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Admin profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.patch("/admin/profile", extractJWT, checkAdmin, uploadAvatar.single('avatar'), async (req: any, res: any) => {
    try {
        const { userName, email, phoneNumber } = req.body;
        const userId = req.user._id;

        const updateData: any = {};
        if (userName) updateData.userName = userName;
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (req.file) updateData.avatar = req.file.path;

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return res.status(500).json({
            message: "Error updating profile",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

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
 *               location:
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
  createAnnouncement
);
router.get("/admin/announcements", getAllAnnouncements);
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
 *               location:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
  updateAnnouncement
);
router.delete(
  "/admin/announcements/:id",
  extractJWT,
  checkAdmin,
  deleteAnnouncement
);

// ─── User Routes (protected) ──────────────────────────────────────────────────
router.get(
  "/admin/users",
  checkAuth,
  hasPermission("read_users"),
  adminController.getAllUsers
);

export default router;

