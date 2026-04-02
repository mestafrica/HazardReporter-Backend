import express from 'express';
import controller from '../controllers/hazardreport';
import { extractJWT, checkAdmin } from '../middlewares/extractJWT';
import upload from '../middlewares/upload';

const router = express.Router();



router.post('/create', extractJWT, upload.array('images', 10), controller.createHazardReport);

router.get('/user-reports', extractJWT, controller.getUserHazardCount);

router.patch('/update/:id', extractJWT, checkAdmin, controller.updateHazardReport);
router.delete('/delete/:id', extractJWT, checkAdmin, controller.deleteHazardReport);

router.get('/getall', controller.getAllHazardReports);
router.get('/getid/:id', controller.getHazardReportById);



export = router;
