//importamos las respuestas predefinidas
import httpResponse from "../utils/http.response.js"
import logger from '../utils/logger/logger.winston.js'

export const errorHandler = (error, req, res, next) => {
    logger.error( `error ${error.message}`)
    return httpResponse.NotFound(res, error.message)
}