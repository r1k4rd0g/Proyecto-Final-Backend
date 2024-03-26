import logger from "./logger.winston.js";

const ejemplo1 = () => {
    logger.fatal('logger fatal nivel 0')
    logger.error('logger error nivel 1')
    logger.warning('logger warning nivel 2')
    logger.info('logger info nivel 3')
    logger.http('logger http nivel 4')
    logger.debug('logger debug nivel 5')
}
export default ejemplo1