import { Router } from 'express';
import productController from '../controllers/products.controller.js'
import { verifyAdmin, verifyRole } from '../middlewares/verifyRole.js';

const router = Router();

router.get('/', verifyRole, productController.getAllCtr);

//router.get('/:id', productController.getById);

router.post('/', verifyRole, productController.createProductsRealTime);

router.put('/:id', verifyRole, productController.update);

router.delete('/:id', verifyRole, productController.remove);

//router.post('/mockingproducts', productController.createProductsMocking)
router.get('/mockingproducts', verifyAdmin, productController.getProductsMocking)

export default router;