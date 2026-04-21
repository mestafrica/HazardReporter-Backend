import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment";

// Add a comment to a hazard report
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, targetId } = req.body;

        // Validate required fields
        if (!content || !targetId) {
            return res.status(400).json({
                message: "content and targetId are required"
            });
        }

        // Validate targetId format
        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ message: "Invalid targetId format" });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const comment = await Comment.create({
            content,
            targetId,
            targetType: 'HazardReport', 
            userId,
        });

        // Populate user details in response
        const populatedComment = await Comment.findById(comment._id)
            .populate('userId', 'userName phoneNumber email')
            .populate('targetId'); 

        return res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get all comments for a specific hazard report
export const getCommentsByTarget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { targetId } = req.params;

        // Validate targetId format
        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ message: "Invalid targetId format" });
        }

        const comments = await Comment.find({ 
            targetId, 
            targetType: 'HazardReport' 
        })
            .populate('userId', 'userName phoneNumber email')
            .populate('targetId')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments,
            count: comments.length,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a comment (only the comment owner can delete)
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid comment ID format" });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Only the comment owner can delete their comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }

        await Comment.findByIdAndDelete(id);

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};