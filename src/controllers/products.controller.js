//importamos class Generic:
import Controllers from "./class.controller.js";
//importamos Service específico:
import productService from "../services/product.service.js";
import socketServer from '../app.js';
import httpResponse from "../utils/http.response.js";
import logger from "../utils/logger/logger.winston.js";
import productRepository from "../persistence/repository/product.repository.js";



class ProductController extends Controllers {
    constructor() {
        super(productService)
    }
    getAllCtr = async (req, res, next) => {
        try {
            const { page, limit, query, sort, category, exist } = req.query;
            const pageNumber = parseInt(page) || 1;
            const pageSize = parseInt(limit) || 10;
            const searchQuery = query || '';
            const sortOrder = (sort === 'asc' || sort === 'desc') ? sort : '';
            let priceFilter = null;
            if (!isNaN(query)) { priceFilter = parseInt(query) }
            const response = await productService.getAll(
                pageNumber,
                pageSize,
                searchQuery,
                sortOrder,
                category || '',
                exist || '',
                priceFilter);
            logger.info(typeof (pageSize) + 'console 1: pageSize' + limit)
            //logger.info('console 2:' + searchQuery);
            //logger.info(typeof(sortOrder) + 'console 3:'+ sortOrder);
            const prevPage = response.prevPage;
            const nextPage = response.nextPage;
            const prevLink = response.hasPrevPage ? `http://localhost:8088/api/products/?page=${prevPage}&limit=${pageSize}&query=${searchQuery}&sort=${sortOrder}` : null;
            const nextLink = response.hasNextPage ? `http://localhost:8088/api/products/?page=${nextPage}&limit=${pageSize}&query=${searchQuery}&sort=${sortOrder}` : null;
            const status = 'success';
            res.json({
                status,
                response,
                products: response.docs,
                payload: response.totalDocs,
                info: {
                    totalPages: response.totalPages,
                    prevPage: response.prevPage,
                    nextPage: response.nextPage,
                    page: response.page,
                    prevLink: prevLink,
                    nextLink: nextLink,
                }
            })
        } catch (error) {
            logger.error('Entró al catch en products.controller de getAllCtr' + error)
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateValues = req.body;
            const productUpdate = await productService.update(id, updateValues);
            if (!productUpdate) {
                return res.status(400).json({ messages: `error al actualizar el producto con id ${id}` })
            } else {
                return res.status(200).json(productUpdate)
            };
        } catch (error) {
            logger.error('Entró al catch en products.controller de update' + error)
            next(error);
        }
    }

    remove = async (req, res, next) => {
        try {
            const { id } = req.params;
            logger.info( 'id recibido del params ' + id)
            const deletedProduct = await productService.delete(id);
            if (!deletedProduct) {
                return res.status(400).json({ messages: `error al eliminar el producto con id: ${id}` })
            } else { return res.status(200).json(deletedProduct); }
        } catch (error) {
            logger.error('Entró al catch en products.controller de remove' + error)
            next(error);
        }
    }
    /**
 * *los códigos de abajo interaccionan con el  views router y, fueron diseñados para aplicar a las vistas */

    getAllSimple = async (req, res, next) => {
        try {
            const products = await productService.getAllSimple();
            const productsDetail = products.map(product => {
                return {
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    thumbnail: product.thumbnail,
                    id: product._id
                }
            })
            const userLog = req.session.passport.user
            logger.info('userLog de products controller' + userLog)
            res.render('productlist', { products: productsDetail, user: userLog },)
        } catch (error) {
            logger.error('Entró al catch en products.controller de getAllSimple' + error)
            next(error)
        }
    }

    getProductsRealTime = async (req, res, next) => {
        try {
            const products = await productService.getAllSimple();
            res.render('realtimeproducts', { products });
        } catch (error) {
            logger.error('Entró al catch en products.controller de getProductsRealTime' + error)
            next(error)
        }
    }
    createProductsRealTime = async (req, res, next) => {
        try {
            //const newProduct = req.body
            const { title, description, code, price, stock, category, thumbnail } = req.body;
            logger.info('EJemplo de lo que llega del body' + title)
            const user = req.session.passport.user;
            const rol = req.session.passport.user.role;
            const id = user._id;
            const owner = rol === 'premium' ? id : 'admin'
            const newProduct = { title, description, code, price, stock, category, thumbnail, owner }
            const productCreated = await productService.create(newProduct);
            logger.info('productCreated en products.controller: ' + productCreated)
            const allProducts = await productService.getAllSimple()
            socketServer.emit('products', allProducts)
            return res.status(201).json(productCreated);
        } catch (error) {
            logger.error('Entró al catch en products.controller de createProductsRealTime' + error)
            next(error);
        }
    }
    getProductByIdDto = async (req, res, next) => {
        try {
            const { id } = req.params
            console.log(id)
            const product = await productRepository.getAllSimpleRepository(id);
            if (!product) return false;
            return httpResponse.Ok(res, product)
        } catch (error) {
            next(error);
        }
    }
    /**generadores faker */
    /*createProductsMocking = async (req, res, next) =>{
        try {
            const {cant} = req.query
            const response = await productService.createMockingProducts(cant);
            return httpResponse.Ok(res, response)
        } catch (error) {
            next(error);
        }
    }*/
    getProductsMocking = async (req, res, next) => {
        try {
            const { cant } = req.body
            console.log(cant)
            const response = await productService.getMockingProducts(cant);
            console.log(response)
            return httpResponse.Ok(res, response)
        } catch (error) {
            next(error);
        }
    }
    /*createFileProductCtr = async (req, res, next) => {
        try {
            const newProducts = await productService.createFileProduct();
            if (!newProducts) throw new Error("validation error");
            return res.status(201).send('Archivo creado correctamente');
        } catch (error) {
            next(error)
        }
    }*/
}
const productController = new ProductController();
export default productController;


