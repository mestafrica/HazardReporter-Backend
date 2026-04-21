import express from "express";
import controller from "../controllers/hazardtypes";
import { extractJWT, checkAdmin } from "../middlewares/extractJWT";

const router = express.Router();

/**
 * @swagger
 * /hazard/create:
 *   post:
 *     summary: Create a new hazard type (admin only)
 *     tags: [Hazard Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hazard type created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.post("/create", extractJWT, checkAdmin, controller.createHazardType);

/**
 * @swagger
 * /hazard/update/{id}:
 *   patch:
 *     summary: Update hazard type (admin only)
 *     tags: [Hazard Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hazard type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hazard type updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.patch(
  "/update/:id",
  extractJWT,
  checkAdmin,
  controller.updateHazardType,
);

/**
 * @swagger
 * /hazard/delete/{id}:
 *   delete:
 *     summary: Delete hazard type (admin only)
 *     tags: [Hazard Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hazard type ID
 *     responses:
 *       200:
 *         description: Hazard type deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.delete(
  "/delete/:id",
  extractJWT,
  checkAdmin,
  controller.deleteHazardType,
);

/**
 * @swagger
 * /hazard/all:
 *   get:
 *     summary: Get all hazard types
 *     tags: [Hazard Types]
 *     responses:
 *       200:
 *         description: List of all hazard types
 */
router.get("/all", controller.getAllHazardTypes);

/**
 * @swagger
 * /hazard/{id}:
 *   get:
 *     summary: Get hazard type by ID
 *     tags: [Hazard Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hazard type ID
 *     responses:
 *       200:
 *         description: Hazard type found
 *       404:
 *         description: Hazard type not found
 */
router.get("/:id", controller.getHazardTypeById);

export default router;
