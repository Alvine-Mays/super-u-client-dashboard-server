import { Router } from 'express';
import { stockController } from '../controllers/stockController';
import { authJWT, requireRole } from '../middlewares/authJWT';

const router = Router();

router.post('/in', authJWT, requireRole('staff','admin'), stockController.in);
router.post('/out', authJWT, requireRole('staff','admin'), stockController.out);
router.post('/adjust', authJWT, requireRole('staff','admin'), stockController.adjust);
router.get('/movements', authJWT, requireRole('staff','admin'), stockController.movements);
router.get('/inventory/levels', authJWT, requireRole('staff','admin'), stockController.inventoryLevels);

export default router;
