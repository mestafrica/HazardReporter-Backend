import express from "express";
import {
    createComment,
    getCommentsByTarget,
    deleteComment
} from "../controllers/comment";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

// Add a comment to a hazard report
router.post("/", checkAuth, createComment);

// Get all comments for a specific hazard report
router.get("/:targetId", getCommentsByTarget);

// Delete a comment
router.delete("/:id", checkAuth, deleteComment);

export default router;