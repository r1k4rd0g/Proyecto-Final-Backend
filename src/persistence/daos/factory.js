import config from '../../config/config.js';

/*** importamos la conexión al servidor de MongoDB */
import { ConnectMongoDB } from '../../config/connection.js';
/*** importamos los DAO de FS  ****/
import CartsDaoFS from './filesystem/carts/carts.dao.js'
import ProductDaoFS from './filesystem/products/products.dao.js'
import UserDaoFS from './filesystem/users/users.dao.js';
import MessageFSDao from './filesystem/messages/messages.dao.js'
import TicketFSDao from './filesystem/tickets/tickets.dao.js'

/*** importamos los DAO de MongoDB  ****/
import CartMongoDao from './mongodb/carts/carts.dao.js'
import ProductMongoDao from './mongodb/products/products.dao.js'
import UserMongoDao from './mongodb/users/users.dao.js'
import MsgMongoDao from './mongodb/messages/messages.dao.js'
import TicketMongoDao from './mongodb/tickets/tickets.dao.js';

/*** Variables y Constantes */
let cartDao;
let userDao;
let productDao;
let msgDao;
let ticketDao;
const persistence = config.PERSISTENCE

//su ejecución es mediante el comando node app.js mongo o la base de datos que a la que se desee conectar ----> /
//let persistence = process.argv[2]



switch (persistence) {
    case "FS":
        cartDao = new CartsDaoFS();
        productDao = new ProductDaoFS();
        userDao = new  UserDaoFS();
        msgDao = new MessageFSDao();
        ticketDao = new TicketFSDao();
        console.log('Persistencia funcionando:', persistence);
        break;
    case "MONGO":
        ConnectMongoDB.getInstance()
        cartDao = new CartMongoDao();
        productDao = new ProductMongoDao();
        userDao = new UserMongoDao();
        msgDao = new  MsgMongoDao();
        ticketDao = new TicketMongoDao();
        console.log('Persistencia funcionando:', persistence);
        break;
    default:
        cartDao = new CartsDaoFS();
        productDao = new ProductDaoFS();
        userDao = new  UserDaoFS();
        msgDao = new MessageFSDao();
        console.log('Persistencia funcionando x Default en:', persistence);
        break;
}


/*** Exportamos las variables que se van a usar en service */
export default { cartDao, userDao, productDao, msgDao, ticketDao };