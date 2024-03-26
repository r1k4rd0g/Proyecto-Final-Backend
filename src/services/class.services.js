import { errorsDictionary } from "../utils/errors.dictionary.js";
import logger from '../utils/logger/logger.winston.js'
export default class Services {
    constructor(dao){
        this.dao = dao;
    }

    //funciones simples:

    //busca todos los items:
    getAll = async ()=>{
        try {
            return await this.dao.getAll();
        } catch (error) {
            logger.error('entró en el catch - class.service - getAll: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET);
        }
    };
    //busca un item por id específico:
    getById = async (id)=>{
        try {
            //logger.info('consola getById de class.services que muestra el id que viene desde controllers:' + id)
            const itemSearch = await this.dao.getById(id);
            //console.log('itemSearch en class.service', itemSearch);
            if(!itemSearch) return false, console.log(`no se encontró item buscado por id ${id}`);
            else return itemSearch;
        } catch (error) {
            logger.error('entró en el catch - class.service - getById: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_FIND);
        }
    };
    //crea un item:
    create = async (obj)=>{
        try {
            const newItem = await this.dao.create(obj);
            if(!newItem) return false;
            //console.log("item no creado, consola create class.service");
            else return newItem;
        } catch (error) {
            logger.error('entró en el catch - class.service - create: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    };

    //actualizar un item:
    update = async (id, obj) =>{
        try {
            console.log('datos que llegan al class.services - update: ', id, obj)
            const itemSearch = await this.dao.getById(id);
            if(!itemSearch) return false;
            //console.log (`item con id: ${id} no encontrado, consola update de class.service`);
            const itemUpdate = await this.dao.update(id, obj);
            return itemUpdate
        } catch (error) {
            logger.error('entró en el catch - class.service - update: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_UPDATE);
        }
    };
    //borrar un item:
    delete = async (id) =>{
        try {
            const itemDelete = await this.dao.delete(id);
            if(!itemDelete) return false;
            logger.info('no se encontró item buscado por id ' + id)
            return itemDelete;
        } catch (error) {
            logger.error('entró en el catch - class.service - delete: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }

}