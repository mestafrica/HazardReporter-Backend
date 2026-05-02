import express from "express";
import {
  createAdminNotification,
  getAdminNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notification";
import { checkAdmin, extractJWT } from "../middlewares/extractJWT";

const router = express.Router();

router.get(
  "/admin/notifications",
  extractJWT,
  checkAdmin,
  getAdminNotifications,
);

router.post(
  "/admin/notifications",
  extractJWT,
  checkAdmin,
  createAdminNotification,
);

router.patch(
  "/admin/notifications/read-all",
  extractJWT,
  checkAdmin,
  markAllNotificationsAsRead,
);

router.patch(
  "/admin/notifications/:id/read",
  extractJWT,
  checkAdmin,
  markNotificationAsRead,
);

export default router;
