import express from "express";
import controller from "../controllers/hazardreport";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";
import upload from "../middlewares/upload";

const router = express.Router();

/**
 * @swagger
 * /hazard-report/create:
 *   post:
 *     summary: Create a new hazard report
 *     tags: [Hazard Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               hazardtype:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *     responses:
 *       201:
 *         description: Hazard report created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  extractJWT,
  upload.array("images", 10),
  controller.createHazardReport,
);

/**
 * @swagger
 * /hazard-report/user-reports:
 *   get:
 *     summary: Get all hazard reports for the authenticated user
 *     tags: [Hazard Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's hazard reports
 *       401:
 *         description: Unauthorized
 */
router.get("/user-reports", extractJWT, controller.getUserHazardCount);

/**
 * @swagger
 * /hazard-report/update/{id}:
 *   patch:
 *     summary: Update a hazard report (owner only, within 1 hour)
 *     tags: [Hazard Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hazard report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hazard report updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not owner or time limit exceeded
 *       404:
 *         description: Hazard report not found
 */
router.patch(
  "/update/:id",
  extractJWT,
  checkAdmin,
  controller.updateHazardReport,
);
/**
 * @swagger
 * /hazard-report/delete/{id}:
 *   delete:
 *     summary: Delete a hazard report
 *     tags: [Hazard Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hazard report ID
 *     responses:
 *       200:
 *         description: Hazard report deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Hazard report not found
 */
router.delete(
  "/delete/:id",
  extractJWT,
  checkAdmin,
  controller.deleteHazardReport,
);

/**
 * @swagger
 * /hazard-report/getall:
 *   get:
 *     summary: Get all hazard reports
 *     tags: [Hazard Reports]
 *     responses:
 *       200:
 *         description: List of all hazard reports
 *       500:
 *         description: Server error
 */
router.get("/getall", controller.getAllHazardReports);
router.get("/getid/:id", controller.getHazardReportById);

// router.patch('/upvote/:id', extractJWT, controller.upvoteHazardReport);

export default router;
