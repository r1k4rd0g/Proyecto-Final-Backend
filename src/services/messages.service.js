//importamos los Crud de servicios:
import Services from './class.services.js';
//importamos el modelo MsgDao:
import persistence from '../persistence/daos/factory.js'
import { errorsDictionary } from '../utils/errors.dictionary.js';
import logger from '../utils/logger/logger.winston.js'



class MsgService extends Services{
    constructor(){
        super(persistence.msgDao)
    }

    removeAll = async ()=>{
        try {
            return await this.dao.deleteAll()
        } catch (error) {
            logger.error('entró en el catch - messages.service - removeAll: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }
}

const msgService = new MsgService(persistence.msgDao);
export default msgService;
