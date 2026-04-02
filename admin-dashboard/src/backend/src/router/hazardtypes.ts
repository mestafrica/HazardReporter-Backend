import express from 'express';
import controller from '../controllers/hazardtypes';
import { extractJWT, checkAdmin } from '../middlewares/extractJWT';

const router = express.Router();

router.post('/create', extractJWT, checkAdmin, controller.createHazardType);
router.patch('/update/:id', extractJWT, checkAdmin, controller.updateHazardType);
router.delete('/delete/:id', extractJWT, checkAdmin, controller.deleteHazardType);

router.get('/all', controller.getAllHazardTypes);
router.get('/:id', controller.getHazardTypeById);

export = router;
