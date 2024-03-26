import ProductResDTO from "../dto/product.res.dto.js";
import persistence from '../daos/factory.js'
import { errorsDictionary } from "../../utils/errors.dictionary.js";

class ProductRepository {
    constructor() {
        this.dao = persistence.productDao
    }
    async getAllSimpleRepository(id) {
        try {
            //console.log('id de consola userRepository:', id)
            const products = await this.dao.getById(id);
            //console.log('user de consola userRepository:', user)
            if (!products) return false;
            //console.log(`no se encontró usuario buscado por id ${id}`)
            else return new ProductResDTO(products);
        } catch (error) {
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
}

const productRepository = new ProductRepository();
export default productRepository;