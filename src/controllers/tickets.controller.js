//importamos clase general:
import Controllers from "./class.controller.js";

import ticketService from "../services/tickets.service.js";
import cartService from "../services/carts.service.js";
import mailSender from "../services/users/mailing.service.js";

class TicketController extends Controllers{
    constructor(){
        super(ticketService);
        this.cartService = cartService
    }
    generateTicket = async (req, res, next)=>{
        try {
            const {cid} = req.params
            const userData = req.session.passport.user
            console.log('userData', userData);
            //console.log('cartId', cartId) //llega ok
            const ticketGenerate = await  this.service.generateTicket(cid, userData)
            if(!ticketGenerate) return false;
            await mailSender.sendMailTicket(userData, ticketGenerate)
            res.json(ticketGenerate)
            return ticketGenerate
        } catch (error) {
            next(error)
        }
    }
}

const ticketController = new TicketController();
export default ticketController;


