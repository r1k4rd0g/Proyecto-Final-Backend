//importamos las respuestas predefinidas:
import httpResponse from "../utils/http.response.js"
//importamos diccionario de errores:
import { errorsDictionary } from "../utils/errors.dictionary.js"
import logger from '../utils/logger/logger.winston.js'

export const verifyAdmin = (req, res, next)=>{
    try {
        const user = req.session.passport.user
        logger.info('rol de verifyAdmin' + user)
        const role = user.role
        logger.info(role)
    if (role === 'admin'){
        next()
    } else  //res.status(403).json ({message: 'Acceso denegado, no tiene permisos para entrar'})
        return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
    } catch (error) {
        logger.error('entró en el catch de verifyRole - verifyAdmin')
        throw new Error(errorsDictionary.ERROR_VERIFY_ROLE)
    }
}

export const verifyUser = (req, res, next)=>{
    try {
        const {role} = req.session.passport.user
    if (role === 'usuario'){
        next()
    } else //res.status(403).json ({message: 'Acceso denegado, no tiene permisos para entrar'})
        return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
    } catch (error) {
        logger.error('entró en el catch de verifyRole - verifyUser')
        throw new Error(errorsDictionary.ERROR_VERIFY_ROLE)
    }
}

export const verifyRole = (req, res, next) => {
    try {
        const { role } = req.session.passport.user;
        switch (role) {
            case 'admin':
                logger.info('rol de verifyAdmin' + role);
                next();
                break;
            case 'premium':
                logger.info('rol de verifyUser' + role);
                next();
                break;
            default:
                return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
        }
    } catch (error) {
        logger.error('Error en verifyRole:', error);
        throw new Error(errorsDictionary.ERROR_VERIFY_ROLE);
    }
};

export const verifyRole2 = (req, res, next) => {
    try {
        const { role } = req.session.passport.user;
        switch (role) {
            case 'usuario':
                logger.info('rol de verifyAdmin' + role);
                next();
                break;
            case 'premium':
                logger.info('rol de verifyUser' + role);
                next();
                break;
            default:
                return httpResponse.Unauthorized(res, errorsDictionary.ERROR_VERIFY_ROLE);
        }
    } catch (error) {
        logger.error('Error en verifyRole:', error);
        throw new Error(errorsDictionary.ERROR_VERIFY_ROLE);
    }
};