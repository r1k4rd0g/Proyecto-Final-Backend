import './passport/github-strategy.js'
import './passport/local-strategy.js'
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import {__dirname} from './utils.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import mainRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import session  from 'express-session';
import passport from 'passport';
import config from './config/config.js';
import {mongoStoreOptions} from './utils.js'
import logger from './utils/logger/logger.winston.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from './docs/info.js';
import productController from './controllers/products.controller.js';
import Services from './services/class.services.js';
import productService from './services/product.service.js';


const app = express();
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));



app.use(express.static('data'));
app.use(express.json()); // lo que hace es traducir  el body de las peticiones a json
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(errorHandler);

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());

app.use(session(mongoStoreOptions));
/* ------------------------------------ - ----------------------------------- */
//inicializamos a nivel de aplicación, debe de ir luego de las otras lineas
app.use(passport.initialize());
app.use(passport.session());
//y van antes del enrutador, lineas de abajo.
/* ------------------------------------ - ----------------------------------- */

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


app.use('/', mainRouter.getRouter());
//app.use('api/sessions', sessionRouter); el endpoint para llamar a las diferentes maneras de login.

const PORT = config.PORT || 8080;
const httpServer = app.listen(PORT, ()=> logger.info(`🚀 Server ok en el puerto ${PORT}`));

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket)=>{
    logger.info('🟢 ¡New Connection' + socket.id);
    socket.on('deleteProduct', async (data)=>{
        try {
            console.log('dato que llega al socket',data)
            const id = data.data
            logger.info('id a eliminar por socket.io --> on: ' + id);
            const productDelete = await productService.delete(id);
            if(!productDelete){
                logger.error('no se pudo borrar el producto')
            }else{
                const products = await productService.getAllSimple();
                socketServer.emit('products', products);
            }
            //console.log('consola 3 app.js:', products);
        } catch (error) {
            socket.emit('deleteProductError', {errorMessage: error.message});
            logger.error(error.message);
        }
    })
})

export default socketServer