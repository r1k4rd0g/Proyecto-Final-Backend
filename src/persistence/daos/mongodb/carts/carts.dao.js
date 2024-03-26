import { CartModel } from "./carts.model.js";
import MongoDao from "../mongo.dao.js";
import { errorsDictionary } from "../../../../utils/errors.dictionary.js";
import logger from "../../../../utils/logger/logger.winston.js";

export default class CartMongoDao extends MongoDao {
    constructor() {
        super(CartModel);
    }

    async saveProductToCart(cid, pid, quantity) {
        try {
            logger.info('viene de service, carts.dao - saveProduct - cid ' + cid)
            const cart = await CartModel.findById(cid).populate('onCart.product');
            console.log('consola linea 35 cart dao', cart, 'id de product:', pid)
            if (!cart) logger.info('no existe el carrito');
            const productExist = cart.onCart.find(item => item.product._id.toString() === pid);
            if (productExist) {
                productExist.quantity += quantity;
                //console.log('productExist:', productExist)
            } else {
                cart.onCart.push({ product: pid, quantity: quantity || 1 });
            }
            cart.save();
            return cart;
            //return await CartModel.findByIdAndUpdate();
        } catch (error) {
            logger.error('entró en el catch mongodb - carts.dao - saveProductToCart: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_ADD_TO_CART);
        }
    }

    async removeProductById(cid, pid) {
        try {

            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { 'onCart': { product: pid } } },
                { new: true }
            ).populate('onCart.product');
            if (!updatedCart) throw new error(errorsDictionary.ERROR_TO_FIND);
            //console.log('Estado del carrito después de eliminar el producto:', updatedCart);
            return updatedCart;
        } catch (error) {
            logger.error('entró en el catch mongodb - carts.dao - removeProductById: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }

    async clearCart(cid) {
        try {
            //console.log('linea 78 cart dao', cid);
            let cartId = cid;
            if (typeof cid === 'object' && cid.cid) {
                cartId = cid.cid;
            }
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId }, // Utiliza solo el ID como criterio de búsqueda
                { onCart: [] }, // Actualiza el campo onCart con un array vacío
                { new: true }
            ).populate('onCart.product');
            if (!updatedCart) {
                throw new Error(error.message, errorsDictionary.ERROR_TO_FIND);
            }
            //console.log('Carrito vaciado:', updatedCart);
            return updatedCart;
        } catch (error) {
            logger.error('entró en el catch mongodb - carts.dao - clearCart: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }
}
