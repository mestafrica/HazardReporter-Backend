import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  NotificationEntityType,
  NotificationType,
} from "../interfaces/notification";
import Notification from "../models/notification";
import {
  createNotification,
  serializeNotification,
} from "../services/notification";

const notificationTypes: readonly NotificationType[] = [
  "report",
  "announcement",
  "user",
  "system",
];

const entityTypes: readonly NotificationEntityType[] = [
  "hazardReport",
  "announcement",
  "user",
  "system",
];

const isOneOf = <T extends string>(
  value: unknown,
  allowedValues: readonly T[],
): value is T =>
  typeof value === "string" && allowedValues.includes(value as T);

const getPositiveInteger = (
  value: string | undefined,
  fallback: number,
  max?: number,
) => {
  const parsed = Number.parseInt(value || "", 10);
  const normalized = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  return max ? Math.min(normalized, max) : normalized;
};

export const getAdminNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = getPositiveInteger(req.query.page as string, 1);
    const limit = getPositiveInteger(req.query.limit as string, 20, 100);
    const skip = (page - 1) * limit;
    const query = req.query.unreadOnly === "true" ? { read: false } : {};

    const [notifications, totalCount, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ read: false }),
    ]);

    return res.status(200).json({
      message: "Notifications retrieved successfully",
      notifications: notifications.map(serializeNotification),
      count: notifications.length,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        pageSize: limit,
        totalCount,
        hasNextPage: skip + notifications.length < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      type,
      title,
      message,
      entityType,
      entityId,
      link,
      metadata,
    } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Notification message is required" });
    }

    if (type !== undefined && !isOneOf(type, notificationTypes)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    if (entityType !== undefined && !isOneOf(entityType, entityTypes)) {
      return res.status(400).json({ message: "Invalid notification entity type" });
    }

    if (
      entityId !== undefined &&
      (typeof entityId !== "string" || !mongoose.Types.ObjectId.isValid(entityId))
    ) {
      return res.status(400).json({ message: "Invalid entity ID format" });
    }

    if (
      metadata !== undefined &&
      (typeof metadata !== "object" || Array.isArray(metadata) || metadata === null)
    ) {
      return res.status(400).json({ message: "Notification metadata must be an object" });
    }

    const notification = await createNotification({
      type,
      title: typeof title === "string" && title.trim() ? title.trim() : "Notification",
      message: message.trim(),
      entityType,
      entityId,
      link: typeof link === "string" ? link : undefined,
      metadata,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      message: "Notification created successfully",
      notification: serializeNotification(notification),
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification ID format" });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification: serializeNotification(notification),
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
