//importamos class Generic:
import Controllers from "./class.controller.js";
//importamos Service específico:
import usersServices from '../services/users/users.service.js';

import { generateToken } from "../jwt/auth.js";

import logger from '../utils/logger/logger.winston.js'

class UserController extends Controllers {
    constructor() {
        super(usersServices)
    }
    register = async (req, res, next) => {
        try {
            const userData = req.body
            logger.info('user.controller - register - userData: ' + userData);
            const user = await usersServices.createUser(userData)
            if (user) res.redirect("/home");
            else res.redirect("/registererror")
        } catch (error) {
            logger.error('Entró al catch en users.controller de register' + error)
            next(error);
        }
    }
    loginResponse = async (req, res, next) => {
        try {
            const id = req.session.passport.user;
            logger.info('users.controllers - loginResponse id de req.session: ' + id)
            const userOk = await usersServices.getById(id);
            logger.info('consola de loginResponse con dato userOk:' + userOk)
            const { email, password } = userOk;
            const token = generateToken(userOk);
            //console.log('token generado en loginResponse userController',token, typeof token);
            //console.log('usuario ok?', userOk);
            if (userOk) {
                req.session.passport.user = userOk;
                req.session.passport.email = email;
                req.session.passport.password = password;
                //console.log('console req.session', userOk)
                //console.log('console req.session.user:', req.session.passport.user)
                //console.log('console req.session.email:', req.session.passport.user.email)
                //console.log('console req.session.password:', req.session.passport.user.password)
                res
                    .header('Authorization', token)//acá dejo establecido el token en el header
                    .cookie('token', token, { httpOnly: true })// acá dejo establecido el token en una cookie
                    .json({ token: token })
                //.redirect("/productlist");
            } else res.redirect("/errorlogin");
        } catch (error) {
            logger.error('Entró al catch en users.controller de loginResponse' + error)
            next(error)
        }
    }
    logout = async (req, res, next) => {
        try {
            const userId = req.session.passport.user._id
            console.log('data de logout: ', userId)
            const userUpdate = await usersServices.logout(userId);
            if (!userUpdate) {
                return res.status(401).send({ message: "Error al cerrar sesión" })
            } else {
                const destroySession = () => new Promise((resolve, reject) => {
                    req.session.destroy((error) => {
                        if (error) {
                            logger.fatal('Error en user.controler - logout if(error): ' + error);
                            reject(error);
                        }
                        resolve();
                    });
                });
                destroySession()
                    .then(async () => {
                        res.clearCookie('connect.sid')
                        res.redirect('/home')
                    })
                    .catch((error) => {
                        logger.error('Error al destruir la sesión: ' + error);
                        return res.redirect('/error')
                    })
            }

        } catch (error) {
            logger.error('Entró al catch en users.controller de logout' + error)
            next(error)
        }
    };
}

const userController = new UserController();
export default userController;