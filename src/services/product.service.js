//importamos los Crud de servicios o las funciones básicas de servicios:
import Services from './class.services.js';
//importamos el modelo ProductDao con las nuevas :
import persistence from '../persistence/daos/factory.js';
import { errorsDictionary } from '../utils/errors.dictionary.js';
import { __dirname } from '../utils.js';
import { generateProducts } from '../utils/faker/products.faker.js';

import logger from '../utils/logger/logger.winston.js'
import fs from 'fs'



class ProductService extends Services {
    constructor() {
        super(persistence.productDao)
        this.userDao = persistence.userDao
    }

    getAllPaginate = async (
        pageNumber = 1,
        pageSize = 10,
        searchQuery = '',
        sortOrder = {},
        category,
        exist,
        priceFilter
    ) => {
        try {
            //validación de pageNumber y pageSize y seteo default por si no es válido
            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1;
            }
            if (isNaN(pageSize) || pageSize < 1) {
                pageSize = 10;
            }
            const buildFilter = (searchQuery, priceFilter, category, exist) => {
                let filter = {};
                if (typeof priceFilter === 'number') {
                    filter['Price'] = priceFilter;
                } else {
                    if (searchQuery !== '') {
                        filter['$or'] = [
                            { 'title': { $regex: searchQuery, $options: 'i' } },
                            { 'description': { $regex: searchQuery, $options: 'i' } },
                            { 'code': { $regex: searchQuery, $options: 'i' } },
                            { 'category': { $regex: searchQuery, $options: 'i' } }
                        ];
                    }
                }
                if (category) {
                    filter['category'] = { $regex: category, $options: 'i' };
                }
                if (exist) {
                    if (exist === 'yes') {
                        filter['stock'] = { $gt: 0 };
                    } else if (exist === 'no') { filter['stock'] = { $lte: 0 } }
                }
                return filter;
            };
            const buildSortOptions = (sortOrder) => {
                let sortOptions = {};
                if (sortOrder === 'asc' || sortOrder === 'desc') {
                    sortOptions['Price'] = sortOrder === 'asc' ? 1 : -1;
                    //console.log('sortOptions:', sortOptions)
                }
                return sortOptions;
            };
            const filter = buildFilter(searchQuery, priceFilter, category, exist);
            //console.log('consola 4:', filter)
            const sortOptions = buildSortOptions(sortOrder);
            //console.log('consola 5', sortOptions)
            const product = await this.dao.getAllPaginate(pageNumber, pageSize, filter, sortOptions);
            return product
        } catch (error) {
            logger.error('entró en el catch - product.service - getAllPaginate: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    };
    getAllSimple = async () => {
        try {
            const products = await this.dao.getAllSimple()
            return products;
        } catch (error) {
            logger.error('entró en el catch - product.service - getAllSimple: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    };
    //esta función está siendo utilizada por socket.io
    removeByOwner = async (pId, userId) => {
        try {
            const idUser = userId
            console.log('user id: ', idUser)
            logger.info('datos que llegan desde socket: ' + pId + ' ' + userId)
            const user = await this.userDao.getById(idUser);
            console.log('usuario encontrado: ',  user)
            if (!user) {
                return false
            }
            const roleUser = user.role
            const productSearch = await this.dao.getById(pId);
            if(!productSearch) return false
            const owner = productSearch.owner
            console.log('owner del producto: ', owner)
            if (roleUser === 'admin' || owner === userId) {
                const productDelete = await this.dao.delete(pId)
                return productDelete
            }
            else {
                return false
            }
        } catch (error) {
            logger.error('entró en el catch - product.service - delete: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_REMOVE);
        }
    }

    /**generadores faker */
    createMockingProducts = async (cant) => {
        try {
            console.log(cant)
            const productsArray = [];
            for (let i = 0; i < cant; i++) {
                const product = generateProducts();
                productsArray.push(product);
            }
            //const products = await this.dao.create(productsArray);
            return productsArray;
        } catch (error) {
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }

    getMockingProducts = async (cant) => {
        try {
            const products = await this.createMockingProducts(cant)
            console.log(products)
            return products;
        } catch (error) {
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
}

const productService = new ProductService(persistence.productDao);
export default productService;
