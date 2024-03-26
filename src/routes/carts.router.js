import { Router } from 'express';
import cartController from '../controllers/carts.controller.js';
import ticketController from '../controllers/tickets.controller.js';
import { verifyUser, verifyRole2 } from '../middlewares/verifyRole.js';

const router = Router();

//import {CartsDaoFS} from '../daos/filesystem/carts.dao.js';
//const cartsDaoFS = new CartsDaoFS('../daos/filesystem/data/carts.json');

//obtiene todos los carritos existentes:
//router.get('/', cartController.getAll); //inhabilitada a solicitud del tutor

//obtiene el carrito por id seleccionado:
router.get('/:cid', verifyUser, cartController.getById);

//crea un carrito:
//router.post('/', cartController.create); // inhabilitado por no uso

router.post('/:cid/product/:pid', cartController.saveProductToCart);

//elimina el carrito por id seleccionado.
//router.delete('/:cid', cartController.removeCartById);

//router.put('/:cid',cartController.updateCart); //actualizar el carrito con los productos que existen
//router.put('/:cid/products/:pid', cartController.updateAll)
router.delete('/:cid/product/:pid', verifyRole2, cartController.removeProductById);

//vacía el carrito:
router.delete('/clear/:cid', verifyUser, cartController.clearCart)

//genera el ticket:
router.post('/:cid/purchase', verifyUser, ticketController.generateTicket)


export default router;