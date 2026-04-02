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

router.post('/create', extractJWT, checkAdmin, uploadAnnouncementFiles.array('attachments', 5), createAnnouncement);

router.get('/getall', getAllAnnouncements);

router.get('/getid/:id', getAnnouncementById);

router.patch('/update/:id', extractJWT, checkAdmin, uploadAnnouncementFiles.array('attachments', 5), updateAnnouncement);

router.delete('/delete/:id', extractJWT, checkAdmin, deleteAnnouncement);

router.delete('/attachment/:id/:attachmentId', extractJWT, checkAdmin, deleteAnnouncementAttachment);

export = router;
