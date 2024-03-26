import {dirname} from 'path';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';
import config from './config/config.js'


/************************** ************************************/
export const __dirname = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------ - ----------------------------------- */

import { hashSync, genSaltSync, compareSync } from 'bcrypt';

export const createHash = (password) =>{
    return hashSync(password, genSaltSync(10))
}
/**
 *
 * @param {*} password contraseña ingresada por usuario, sin hashear
 * @param {*} user, usuario ingresado y que se buscará en la base de datos
 * @returns retorna un booleano, true o false
 */
export const isValidPass = (password, user)=>{
    return compareSync(password, user.password) //toma el password que no está haseado y lo compara con el pass que está en la base de datos de ese usuario.
}

/*-función de respuestas -*/

export const createResponse = (res, statusCode, data)=>{
    return res.status(statusCode).json({data});
}

/*-cookie -*/

const connectionURL = config.MONGO_URL;
export const mongoStoreOptions ={
    store: MongoStore.create({
        mongoUrl: connectionURL,
        ttl: 180,
        crypto:{
            secret : '1234'
        }
    }),
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 180000,
        secure: false,
        httpOnly: true
    }
}