import 'dotenv/config';
import { Server } from 'socket.io';
import productService from '../services/product.service.js';
import logger from './logger/logger.winston.js';


let socketServer;

const initSocket = (httpServer) => {
    socketServer = new Server(httpServer);
    socketServer.on('connection', async (socket) => {
        logger.info('🟢 ¡New Connection: ' + socket.id);
        socket.on('deleteProduct', async (data) => {
            try {
                console.log('dato que llega al socket', data)
                const pId = data.idToDelete;
                const userId = data.userId;
                logger.info('id a eliminar por socket.io --> on: ' + pId);
                console.log('usuario desde front: ', userId)
                const productDelete = await productService.removeByOwner(pId, userId);
                if (!productDelete) {
                    socket.emit('productDeleted', {message: 'Error al eliminar el producto, no tienes permisos o no se encontró '})
                    logger.error('no se pudo borrar el producto')
                } else {
                    const products = await productService.getAllSimple();
                    socket.emit('productDeleted', {message: 'Producto eliminado correctamente '})
                    socketServer.emit('products', products);
                };
                //console.log('consola 3 app.js:', products);
            } catch (error) {
                socket.emit('deleteProductError', { errorMessage: error.message });
                logger.error(error.message);
            }
        })
        socket.on('solicitud', async () => {
            logger.info('🔄 Solicitud de Productos');
            try {
                const products = await productService.getAllSimple();
                socketServer.emit('products', products)
            } catch (error) {
                socket.emit('solicitudError', { errorMessage: error.message });
                logger.error(error.message);
            }
        })
    })
}

const getSocketServer = () => socketServer;

export { initSocket, getSocketServer };
