// creamos el CRUD que se utilizará en todas las clases.
import { errorsDictionary } from "../../../utils/errors.dictionary.js";
import logger from '../../../utils/logger/logger.winston.js'

export default class MongoDao {
    constructor(model) {
        this.model = model; //la variable this.model, será igual al modelo que llegue por el constructor.
    }
    //Crud:

    async getAll(){
        try {
            const response = await this.model.find({});
            return response;
        } catch (error) {
            logger.error('entró en el catch mongodb - mongo.dao - getAll: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET);
        }
    }

    async getById(id){
        try {
            //console.log('id en consola mongo dao:', id)
            const response = await this.model.findById(id);
            return response;
        } catch (error) {
            logger.error('entró en el catch mongodb - mongo.dao - getById: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_FIND);
        }
    }

    async create(obj) {
        try {//console.log('consola mongo dao create', obj)
            const response = await this.model.create(obj);
            console.log('consola create de mongo.dao', response)
            return response;
        } catch (error) {
            logger.error('entró en el catch mongodb - mongo.dao - create: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }

    async update (id, obj) {
        try {
            await this.model.updateOne({_id: id}, obj); //actualiza una solo.
            return obj
        } catch (error) {
            logger.error('entró en el catch mongodb - mongo.dao - update: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_UPDATE);
        }
    }

    async delete (id){
        try {
            const response = await this.model.findByIdAndDelete(id);
            return response;
        } catch (error) {
            logger.error('entró en el catch mongodb - mongo.dao - delete: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }
}