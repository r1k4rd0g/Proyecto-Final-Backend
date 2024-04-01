//import logger from '../utils/logger/logger.winston.js'
import persistence from '../persistence/daos/factory.js';
import Services from './class.services.js';
import { errorsDictionary } from '../utils/errors.dictionary.js';
import httpResponse from '../utils/http.response.js';


class CartService extends Services {
    constructor() {
        super(persistence.cartDao);
        this.productDao = persistence.productDao
    }
    saveProductToCart = async (cid, pid, quantity, idUser) => {
        try {
            //console.log('que llega del controller en service?: cid: ',cid , 'pid: ', pid, 'quantity: ', quantity ,'id de cliente: ', id) //llega todo ok
            const userId = idUser
            const productSearch = await this.productDao.getById(pid);
            console.log('productSearch linea 17: ', productSearch)
            if (!productSearch) {
                return { success: false, message: 'No se encontró el producto' }//httpResponse.NotFound(res,'no se encontró el producto')
            }
            console.log('id user que viene de controller:',idUser)
            console.log('productSearch.owner', productSearch.owner)
            if (userId === productSearch.owner) {
                return false //{success: false, message: 'No puedes agregar productos creados por ti al carrito'} //httpResponse.Unauthorized(res, 'No puedes agregar productos creados por ti al }carrito')
            }else {
                const cartUpdate = await this.dao.saveProductToCart(cid, pid, quantity);
                if (!cartUpdate) {
                    console.log(cartUpdate)
                    return { success: false, message: 'No se encontró el carrito' };;// httpResponse.NotFound('no se encontró carrito')
                } return { success: true, cartUpdate };
            }
        } catch (error) {
            logger.error('entró en el catch - carts.service - saveProductToCart: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_ADD_TO_CART);
        }
    };

    removeCartById = async (cid) => {
        try {
            const cartRemove = await this.dao.delete(cid)
            if (!cartRemove) return false;
            //console.log(`carrito con id: ${cid}, no encontrado`);
            else return cartRemove;
        } catch (error) {
            //logger.error('entró en el catch - carts.service - removeCartById: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    };

    removeProductById = async (cid, pid) => {
        try {
            const productSearch = await this.productDao.getById(pid);
            //console.log('Producto buscado linea 60 cart service',productSearch)
            if (!productSearch) throw new Error(errorsDictionary.ERROR_TO_FIND);
            const cartUpdate = await this.dao.removeProductById(cid, pid);
            //console.log('Linea 63 cart service cartUpdate',cartUpdate)
            if (!cartUpdate) return false;
            //console.log(`carrito buscado en carts.service con id: ${cid}, no encontrado`);
            else return cartUpdate;
        } catch (error) {
            //logger.error('entró en el catch - carts.service - removeProductById: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }

    clearCart = async (cid) => {
        try {
            const cartToClear = await this.dao.clearCart(cid);
            if (!cartToClear) return false;
            //console.log(`Carrito con id:${cid}, no encontrado`)
            else return cartToClear
        } catch (error) {
            //logger.error('entró en el catch - carts.service - clearCart: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
}
const cartService = new CartService();
export default cartService;
