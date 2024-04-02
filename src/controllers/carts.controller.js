//importamos clase general:
import Controllers from './class.controller.js';
//importamos servicios:
import cartService from '../services/carts.service.js';
import { createResponse } from '../utils.js';
import logger from '../utils/logger/logger.winston.js';
import httpResponse from '../utils/http.response.js';

class CartController extends Controllers {
    constructor() {
        super(cartService)
    }
    saveProductToCart = async (req, res, next) => {
        try {
            // logger.info('req.body que llega al controlador' + req.body, 'lo que llega de params' + req.params);
            const { quantity } = req.body;
            const { pid, cid } = req.params
            const userLog = req.session.passport.user;
            const idUser = userLog._id
            //console.log('consola id de usuario', idUser)
            logger.info('consola id de usuario: ' + idUser)
            //logger.info('quantity del carrito' + typeof(quantity) +' '+ quantity)
            //logger.info('id del carrito ' + typeof(cid)+' ' + cid)
            //logger.info('id del cliente '+ id)
            const updateCart = await cartService.saveProductToCart(cid, pid, quantity, idUser);
            logger.info('carrito actualizado: ' + JSON.stringify(updateCart));
            if (!updateCart || null || false ) {return httpResponse.Forbidden(res, 'forbidden')}
            else {return res.status(200).json(updateCart);}
        } catch (error) {
            //logger.error('Entró al catch en cart.controller de saveProductToCart' + error)
            next(error)
        }
    };

    removeCartById = async (req, res, next) => {
        try {
            const cid = req.params.cid;
            const response = await cartService.removeCartById(cid);
            res.status(200).json(response);
        } catch (error) {
            //logger.error('Entró al catch en cart.controller de removeCartById' + error)
            next(error)
        }
    }
    removeProductById = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const updateCart = await cartService.removeProductById(cid, pid);
            res.status(200).json(updateCart);
        } catch (error) {
            //logger.error('Entró al catch en cart.controller de removeProductById' + error)
            next(error)
        }
    };

    clearCart = async (req, res, next) => {
        try {
            const cid = req.params;
            const response = await cartService.clearCart(cid);
            res.status(200).json(response)
        } catch (error) {
            //logger.error('Entró al catch en cart.controller de clearCart' + error)
            next(error)
        }
    }
}

const cartController = new CartController();
export default cartController;
