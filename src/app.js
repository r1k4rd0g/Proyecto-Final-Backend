import './passport/github-strategy.js'
import './passport/local-strategy.js'
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import {__dirname} from './utils.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
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
import { initSocket } from './utils/socket.io.js';
import cors from 'cors';


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

app.use(cors());
app.use('/', mainRouter.getRouter());
//app.use('api/sessions', sessionRouter); el endpoint para llamar a las diferentes maneras de login.

const PORT = config.PORT || 8080;
const httpServer = app.listen(PORT, ()=> logger.info(`🚀 Server ok en el puerto ${PORT}`));

initSocket(httpServer);
export default app