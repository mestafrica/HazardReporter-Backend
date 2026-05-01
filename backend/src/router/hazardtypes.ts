import express from "express";
import controller from "../controllers/hazardtypes";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";

const router = express.Router();

router.post("/create", extractJWT, checkAdmin, controller.createHazardType);
router.get("/getall", controller.getAllHazardTypes);
router.get("/getid/:id", controller.getHazardTypeById);
router.patch("/update/:id", extractJWT, checkAdmin, controller.updateHazardType);
router.delete("/delete/:id", extractJWT, checkAdmin, controller.deleteHazardType);

export default router;
