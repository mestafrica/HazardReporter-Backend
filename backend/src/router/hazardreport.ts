import express from 'express';
import controller from '../controllers/hazardreport';
import { extractJWT, checkAdmin } from '../middlewares/extractJWT';
import upload from '../middlewares/upload';

const router = express.Router();



router.post('/create', extractJWT, upload.array('images', 10), controller.createHazardReport as express.RequestHandler);

router.get('/user-reports', extractJWT, controller.getUserHazardCount);

router.delete('/delete/:id', extractJWT, checkAdmin, controller.deleteHazardReport);

router.get('/getall', controller.getAllHazardReports);
router.get('/getid/:id', controller.getHazardReportById);
console.log("hazardreport router loaded");

router.patch(
  '/update/:id',
  extractJWT,
  (req, res, next) => {
    console.log("PATCH ROUTE MATCHED");
    return controller.updateHazardReport(req, res, next);
  }
);



export default router;
