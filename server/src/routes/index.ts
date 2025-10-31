import { Router } from 'express';
import auth from './auth';
import products from './products';
import categories from './categories';
import stock from './stock';
import activity from './activity';
import maintenance from './maintenance';

const router = Router();

router.use('/auth', auth);
router.use('/products', products);
router.use('/categories', categories);
router.use('/stock', stock);
router.use('/staff/activity', activity);
router.use('/staff/maintenance', maintenance);

export default router;
