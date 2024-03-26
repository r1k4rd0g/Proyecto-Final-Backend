import jwt from 'jsonwebtoken';
import logger from '../utils/logger/logger.winston.js'

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const generateToken = (user) => {
    try {
        const payload = {
            userId: user._id,
            //email: user.email
        };
        const token = jwt.sign(payload, SECRET_KEY_JWT, {
            expiresIn: 1200, //20 minutos
        });
        return token;
    } catch (error) {
        logger.error('error al general token en auth.js' + error);
        throw new Error('error al generar token');
    }
}