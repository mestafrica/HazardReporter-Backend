import express from "express";
import { createComment } from "../controllers/comment";
// You imported it as checkAuth here...
import { checkAuth, hasPermission } from "../middlewares/auth";

const router = express.Router();

router.post("/", checkAuth, createComment);

export default router;
