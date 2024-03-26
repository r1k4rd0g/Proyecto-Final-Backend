import Services from "./class.services.js";
import persistence from '../persistence/daos/factory.js';
import { errorsDictionary } from "../utils/errors.dictionary.js";
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger/logger.winston.js'


class TicketService extends Services {
    constructor() {
        super(persistence.ticketDao)
        this.cartDao = persistence.cartDao
        this.productDao = persistence.productDao;

    }
    generateTicket = async (cid, userData) => {
        try {
            logger.info('cart id en ticket.services' + cid) //ok
            const cart = await this.cartDao.getById(cid)
            //console.log('cart que viene del dao buscado:', cart) //ok
            let amountAcc = 0;
            for (const p of cart.onCart) {
                const pid = p.product._id.toString();
                const productData = await this.productDao.getById(pid)
                if (p.quantity <= productData.Stock) {
                    const amount = p.quantity * productData.Price;
                    amountAcc += amount;
                    productData.Stock -= p.quantity;
                    const stockUpdate = await this.productDao.update(pid, productData.Stock);
                } else {
                    return false
                }
            }
            const newCode = uuidv4();
            const newTicket = await this.dao.generateTicket({
                code: newCode,
                purchaseDataTime: new Date().toLocaleString(),
                amount: amountAcc,
                purchaser: {email:userData.email, userId:userData._id}
            });
            cart.onCart = [];
            cart.save();
            //console.log('ticket creado?:', newTicket)d
            return newTicket;
        } catch (error) {
            logger.error('entró en el catch - ticket.service - generateTicket: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }
}

const ticketService = new TicketService()
export default ticketService;