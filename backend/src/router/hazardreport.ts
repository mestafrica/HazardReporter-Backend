import express from "express";
import controller from "../controllers/hazardreport";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/create", extractJWT, upload.array("images", 5), controller.createHazardReport);
router.get("/getall", controller.getAllHazardReports);
router.get("/getid/:id", controller.getHazardReportById);
router.patch("/update/:id", extractJWT, controller.updateHazardReport);
router.delete("/delete/:id", extractJWT, checkAdmin, controller.deleteHazardReport);
router.get("/user/count", extractJWT, controller.getUserHazardCount);

export default router;