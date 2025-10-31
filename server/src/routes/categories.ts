import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authJWT, requireRole } from '../middlewares/authJWT';

const router = Router();

router.get('/', categoryController.list);
router.get('/:id', categoryController.get);
router.post('/', authJWT, requireRole('staff','admin'), categoryController.create);
router.put('/:id', authJWT, requireRole('staff','admin'), categoryController.update);
router.delete('/:id', authJWT, requireRole('staff','admin'), categoryController.remove);

export default router;
