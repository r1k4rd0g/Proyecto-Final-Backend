import MongoDao from '../mongo.dao.js';
import {TicketModel} from './tickets.model.js';
import { errorsDictionary } from '../../../../utils/errors.dictionary.js';
import logger from '../../../../utils/logger/logger.winston.js'

export default class TicketMongoDao extends MongoDao{
    constructor(){
        super(TicketModel)
    };
    async generateTicket (datos) {
        try {
            logger.info('lo que llega de service a ticket.dao' + datos )
            const newTicket = await TicketModel.create(datos)
            logger.info('ticket nuevo desde ticket.dao:' + newTicket);
            return newTicket;
        } catch (error) {
            logger.error('Entró en el catch de mongodb - tickets.dao - generate' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }
}

