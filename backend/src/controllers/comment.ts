import { Request, Response } from "express";
import Comment from "../models/comment";
import { IUser } from "../interfaces/user";

interface AuthRequest extends Request {
  user?: IUser;
}

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, hazardReportId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const comment = await Comment.create({
      content,
      hazardReportId,
      userId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
