import express from "express";
import controller from "../controllers/auth";

const router = express.Router();

router.post("/forgot-password", controller.forgotPassword);

router.get("/reset-token/:id", controller.verifyResetToken);

router.post("/reset-password", controller.resetPassword);

export default router;
