import { Router } from 'express';
import productController from '../controllers/products.controller.js'
import { verifyAdmin, verifyRole } from '../middlewares/verifyRole.js';

const router = Router();

router.get('/', verifyAdmin, productController.getAllCtr);

//router.get('/:id', productController.getById);

router.post('/', verifyAdmin, productController.create);

//crear los productos desde un file --->
//router.post('/file', productController.createFileProductCtr)

router.put('/:id', verifyRole, productController.update);

router.delete('/:id', verifyAdmin, productController.remove);

//router.post('/mockingproducts', productController.createProductsMocking)
router.get('/mockingproducts', verifyAdmin, productController.getProductsMocking)

export default router;