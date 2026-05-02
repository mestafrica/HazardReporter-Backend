import { Types } from "mongoose";
import {
  INotification,
  NotificationEntityType,
  NotificationType,
} from "../interfaces/notification";
import Notification from "../models/notification";
import { broadcastNotification } from "./notificationSocket";

export interface CreateNotificationInput {
  type?: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: Types.ObjectId | string;
  link?: string;
  metadata?: Record<string, unknown>;
  createdBy?: Types.ObjectId | string;
}

export const serializeNotification = (notification: INotification) => {
  const object = notification.toObject({ virtuals: true }) as Record<
    string,
    unknown
  >;

  return {
    ...object,
    id: notification._id.toString(),
  };
};

export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await Notification.create({
    type: input.type || "system",
    title: input.title,
    message: input.message,
    entityType: input.entityType,
    entityId: input.entityId,
    link: input.link,
    metadata: input.metadata,
    createdBy: input.createdBy,
  });

  broadcastNotification(serializeNotification(notification));
  return notification;
};
