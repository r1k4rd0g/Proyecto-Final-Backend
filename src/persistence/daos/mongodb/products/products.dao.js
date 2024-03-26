import {ProductModel} from './products.model.js';
import MongoDao from '../mongo.dao.js';
import { errorsDictionary } from '../../../../utils/errors.dictionary.js';

export default class ProductMongoDao extends MongoDao{
    constructor(){
        super(ProductModel);
    };

    async getAllPaginate(pageNumber, pageSize, filter, sortOptions){
        const options = {
            page : pageNumber,
            limit: pageSize,
            sort: sortOptions,
            /*customLabels: {
                totalDocs: 'totalProducts',
                docs: 'products'
            }*/
        }
        try {
            const response = await ProductModel.paginate(filter, options);
            return response;
        } catch (error) {
            logger.error('entró en el catch mongodb - products.dao - getAllPaginate: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET)
        }
    };
    async getAllSimple() {
        try {
            return await ProductModel.find({});
        } catch (error) {
            logger.error('entró en el catch mongodb - products.dao - getAllSimple: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET)
        }
    }
}

