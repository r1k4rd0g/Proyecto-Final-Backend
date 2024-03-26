import {MsgModel} from './messages.model.js';
import MongoDao from '../mongo.dao.js';
import { errorsDictionary } from '../../../../utils/errors.dictionary.js';

export default class MsgMongoDao extends MongoDao{
    constructor(){
        super(MsgModel);
    }
    async deleteAll(){
        try {
            return await MsgModel.deleteMany({});
        } catch (error) {
            logger.error('entró en el catch mongodb - messages.dao - deleteAll: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }
}

