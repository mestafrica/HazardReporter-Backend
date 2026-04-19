import express from "express";
import controller from "../controllers/auth";
import upload from "../middlewares/upload";

const router = express.Router();

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", upload.none(), controller.forgotPassword);

/**
 * @swagger
 * /reset-token/{id}:
 *   get:
 *     summary: Verify password reset token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset token
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.get("/reset-token/:id", controller.verifyResetToken);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid input or token expired
 */
router.post("/reset-password", upload.none(), controller.resetPassword);

export default router;
