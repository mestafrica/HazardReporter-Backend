import express from "express";
import controller from "../controllers/user";
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

const router = express.Router();

// Admin auth routes
router.post("/admin/signup", controller.adminSignup);
router.post("/admin/signin", controller.adminSignin);
router.post("/admin/logout", checkAuth, controller.adminLogout);

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
router.patch(
    "/admin/reports/:id/status",         
    checkAuth,
    hasPermission("update_report_status"),
    hazardReportController.updateReportStatus
);

// Announcement Routes (for admin only)
router.post(
    "/admin/announcements",              
    extractJWT,
    checkAdmin,
    uploadAnnouncementFiles.array("attachments", 5),
    createAnnouncement
);
router.get(
    "/admin/announcements",            
    getAllAnnouncements
);
router.get(
    "/admin/announcements/:id",          
    getAnnouncementById
);
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
export default router;
