//importamos las respuestas predefinidas:
import httpResponse from "../utils/http.response.js"
//importamos diccionario de errores:
import { errorsDictionary } from "../utils/errors.dictionary.js"
import logger from '../utils/logger/logger.winston.js'

export const verifyAdmin = (req, res, next) => {
    try {
        const user = req.session.passport.user
        logger.info('rol de verifyAdmin' + JSON.stringify(user))
        const role = user.role
        logger.info('role transformado: ' + role)
        if (role === 'admin') {
            next();
        } else {
            logger.info('no hay autorización para seguir, debido a tu rol')
            return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
        }
    } catch (error) {
        logger.error('entró en el catch de verifyRole - verifyAdmin')
        throw new Error(errorsDictionary.ERROR_CATCH)
    }
}

export const verifyUser = (req, res, next) => {
    try {
        const { role } = req.session.passport.user
        if (role === 'usuario') {
            next()
        } else
            logger.info('no hay autorización para seguir, debido a tu rol')
        return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
    } catch (error) {
        logger.error('entró en el catch de verifyRole - verifyUser')
        throw new Error(errorsDictionary.ERROR_CATCH)
    }
}

export const verifyRole = (req, res, next) => {
    try {
        const { role } = req.session.passport.user;
        switch (role) {
            case 'admin':
                logger.info('rol de verifyRole1: ' + role);
                next();
                break;
            case 'Premium':
                logger.info('rol de verifyRole1: ' + role);
                next();
                break;
            default:
                return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
        }
    } catch (error) {
        logger.error('Error en verifyRole:', error);
        throw new Error(errorsDictionary.ERROR_CATCH);
    }
};

export const verifyRole2 = (req, res, next) => {
    try {
        const { role } = req.session.passport.user;
        logger.info('rol de usuario de verifyRole2: ' + role)
        switch (role) {
            case 'usuario':
                logger.info('rol de verifyRole2: ' + role);
                next();
                break;
            case 'Premium':
                logger.info('rol de verifyRole2: ' + role);
                next();
                break;
            default:
                logger.info('rol no esperado, entró en default: ' + role)
                return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
        }
    } catch (error) {
        logger.error('Error en verifyRole:', error);
        throw new Error(errorsDictionary.ERROR_CATCH);
    }
};