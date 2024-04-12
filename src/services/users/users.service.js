//importamos los Crud de servicios o las funciones básicas de servicios:
import Services from '../class.services.js'
//importamos el modelo UserMongo con las nuevas :
import persistence from '../../persistence/daos/factory.js';

//importamos utils:
import { createHash, isValidPass, generateResetPassLink } from "../../utils.js";
import { errorsDictionary } from '../../utils/errors.dictionary.js';
import logger from '../../utils/logger/logger.winston.js'

import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import mailSender from './mailing.service.js';
import userRepository from '../../persistence/repository/user.repository.js';



class UserService extends Services {
    constructor() {
        super(persistence.userDao)
        this.cartDao = persistence.cartDao
    }
    createUser = async (userData) => {
        try {
            console.log('userData services', typeof (userData), userData)
            const { first_name, last_name, email, password, role, age, isGithub } = userData;
            const newCart = await this.cartDao.create()
            console.log('carrito nuevo al crear usuario', newCart)
            const cartId = newCart._id;
            //console.log('consola 9', typeof email, typeof password, typeof first_name)
            if (email === 'adminCoder@coder.com' && password === 'adminCoder123') {
                const newUser = await this.dao.create({
                    ...userData,
                    password: createHash(password),
                    role: 'admin'
                });
                return newUser
            }
            const newUser = await this.dao.create({
                first_name,
                last_name,
                age: 18 || age,
                email,
                password: createHash(password),
                role,
                isGithub,
                cart: cartId
            })
            if (!newUser) return false;
            //console.log('consola de users.services const createUser:', newUser);
            return newUser;
        } catch (error) {
            logger.error('entró en el catch - users.service - createUser: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }

    login = async (user) => {
        try {
            //console.log('consola lo que viene de user:', user)//puede venir de controller o local strategy
            const { email, password } = user;
            const userExist = await this.dao.searchByEmail(email);
            //console.log('consola login user service exist:', userExist)
            if (userExist) {
                const passValid = isValidPass(password, userExist);
                if (!passValid) return false;
                else {
                    userExist.last_connection = new Date();
                    await userExist.save();
                    return userExist
                }
            }
            return false;
        } catch (error) {
            logger.error('entró en el catch - users.service - login: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }

    getByEmail = async (email) => {
        try {//console.log(email, typeof email, 'verifico email en service')
            const userSearch = await this.dao.searchByEmail(email);
            if (!userSearch) return false;
            //console.log(`usuario no encontrado en user.service con ${email}`);
            else return userSearch
        } catch (error) {
            logger.error('entró en el catch - users.service - getByEmail: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    }

    logout = async (userId) => {
        try {
            const id = userId
            console.log('id del services logout: ', id)
            const userExist = await this.dao.getById(id)
            console.log('userExiste del services logout: ', userExist)
            if (!userExist) return false;
            else {
                userExist.last_connection = new Date();
                await userExist.save();
                return userExist
            }
        } catch (error) {
            logger.error('entró en el catch - users.service - logout: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
    solicitudResetPass = async (data) => {
        try {
            console.log('viene de controller: ', data);
            const user = await this.dao.searchByEmail(data);
            const email = user.email
            console.log('email: ', email);
            if (!user) {
                return false;
            } else {
                const token = jwt.sign(
                    { email },
                    config.SECRET_KEY_JWT,
                    { expiresIn: "1h" },
                    //{ expiresIn: "5m"}
                )
                const resetLink = `http://localhost:8088/resetPass?token=${token}`
                const response = await mailSender.sendResetPass(user.email, resetLink);
                console.log('respuesta servicio: ', response)
                return true;
            }
        } catch (error) {
            logger.error('entró en el catch - users.service - resetPass: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
    verifyToken = async (token) => {
        try {
            const tokenToValidate = token
            console.log('token desde controller: ', tokenToValidate)
            const decodedToken = jwt.verify(tokenToValidate, config.SECRET_KEY_JWT)
            console.log("decodificado", decodedToken)
            if (!decodedToken) {
                return false
            } else {
                return decodedToken
            }
        } catch (error) {
            logger.error('entró en el catch - users.service - verifyToken: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
    newPass = async (newPass, userEmail) => {
        try {
            const password = newPass
            console.log('lo que llega de controller; ', newPass, ' ', userEmail)
            const user = await this.dao.searchByEmail(userEmail);
            console.log('usuario encontrado: ', user)
            if (user) {
                const passValid = isValidPass(password, user);
                console.log(passValid)
                if (!passValid) {
                    const hashedPass = createHash(password);
                    const id = user._id
                    const update = await this.dao.update(id, { 'password': hashedPass })
                    console.log('respuesta del dao, update: ', update)
                    return update
                } else {
                    return false
                }
            }
        } catch (error) {
            logger.error('entró en el catch - users.service - newPass: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
    getAllUsers = async () => {
        try {
            const users = await userRepository.getAllUsers()
            //console.log('usuarios que llegan del repository Get All Users: ', users)
            if (!users) {
                return false
            } else {
                return users
            }
        } catch (error) {
            logger.error('entró en el catch - users.service - getAllUsers: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
    removeUsers = async (users) => {
        try {
            const usersToDelete = users.filter(user =>{
                if(user.last_connection){
                    const lastConnection = new Date (user.last_connection)
                    const now = new Date();
                    const diffTime = Math.abs(now-lastConnection)/36e5;
                    return   diffTime > 48;
                }
                return false;
            });
            for (const user of usersToDelete){
                await this.dao.delete(user._id);
                await mailSender.userDelete(user)
            }
            //logger.info('usersToDelete de users.services: ' + usersToDelete)
            return usersToDelete
        } catch (error) {
            logger.error('entró en el catch - users.service - removeUsers: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_DEFAULT);
        }
    }
}

const usersServices = new UserService(persistence.userDao);
export default usersServices;

