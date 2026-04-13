import express from 'express';
import { extractJWT, checkAdmin } from '../middlewares/extractJWT';
import { uploadAnnouncementFiles } from '../middlewares/cloudinaryUpload';
import {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    deleteAnnouncementAttachment
} from '../controllers/announcement';

const router = express.Router();

/**
 * @swagger
 * /announcement/create:
 *   post:
 *     summary: Create an announcement (admin only)
 *     tags: [Announcements]
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
 *               detail:
 *                 type: string
 *               category:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.post('/create', extractJWT, checkAdmin, uploadAnnouncementFiles.array('attachments', 5), createAnnouncement);

/**
 * @swagger
 * /announcement/getall:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of all announcements
 */
router.get('/getall', getAllAnnouncements);

/**
 * @swagger
 * /announcement/getid/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement found
 *       404:
 *         description: Announcement not found
 */
router.get('/getid/:id', getAnnouncementById);

/**
 * @swagger
 * /announcement/update/{id}:
 *   patch:
 *     summary: Update announcement (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.patch('/update/:id', extractJWT, checkAdmin, uploadAnnouncementFiles.array('attachments', 5), updateAnnouncement);

/**
 * @swagger
 * /announcement/delete/{id}:
 *   delete:
 *     summary: Delete announcement (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.delete('/delete/:id', extractJWT, checkAdmin, deleteAnnouncement);

/**
 * @swagger
 * /announcement/attachment/{id}/{attachmentId}:
 *   delete:
 *     summary: Delete announcement attachment (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not admin
 */
router.delete('/attachment/:id/:attachmentId', extractJWT, checkAdmin, deleteAnnouncementAttachment);

export = router;
