import { createResponse } from '../utils.js';
import logger from '../utils/logger/logger.winston.js';

export default class Controllers {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res, next) => {
        try {
            const items = await this.service.getAll();
            return createResponse(res, 200, items)
        } catch (error) {
            logger.error('Entró al catch en class.controller getAll' + error)
            next(error)
        }
    }

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.service.getById(id);
            if (!item) {
                return createResponse(res, 404, {
                    method: "getById",
                    error: `El item con id: ${id} no se encuentra en la base de datos.`
                })
            } else {
                return createResponse(res, 200, item)
            };
        } catch (error) {
            logger.error('Entró al catch en class.controller getById' + error)
            next(error)
        }
    }
    create = async (req, res, next) => {
        try {
            const itemToCreate = req.body
            const newItem = await this.service.create(itemToCreate)
            if (!newItem) {
                return (res, 404, {
                    method: "create",
                    error: `Error al crear el item:  ${itemToCreate}`
                })
            } else {
                return (res, 201, newItem)
            }
        } catch (error) {
            logger.error('Entró al catch en class.controller create' + error)
            next(error)
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            console.log('id que llega al class.controller - update', id)
            const itemToUpdate = req.body;
            console.log('item a actualizar:', itemToUpdate)
            const itemSearch = await this.service.getById(id);
            if (!itemSearch) {
                return createResponse(res, 404, {
                    method: 'update',
                    error: `El item con id: ${id} no se encuentra en la base de datos.`
                });
            } else {
                const itemUpdated = await this.service.update(id, itemToUpdate);
                return createResponse(res, 200, itemUpdated)
            }
        } catch (error) {
            logger.error('Entró al catch en class.controller update' + error)
            next(error)
        }
    }
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const itemSearch = await this.service.getById(id);
            if (!itemSearch) {
                return createResponse(res, 404, {
                    method: 'delete',
                    error: `El item con id: ${id} no se encuentra en la base de datos`
                })
            } else {
                const itemDelete = await this.service.delete(id);
                return createResponse(res, 200, itemDelete);
            }
        } catch (error) {
            logger.error('Entró al catch en class.controller delete' + error)
            next(error)
        }
    }
}