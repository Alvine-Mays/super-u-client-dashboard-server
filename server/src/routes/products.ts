import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authJWT, requireRole } from '../middlewares/authJWT';

const router = Router();

router.get('/', productController.list);
router.get('/:id', productController.get);
router.post('/', authJWT, requireRole('staff','admin'), productController.create);
router.put('/:id', authJWT, requireRole('staff','admin'), productController.update);
router.delete('/:id', authJWT, requireRole('staff','admin'), productController.remove);

export default router;
