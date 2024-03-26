//importamos los Crud de servicios o las funciones básicas de servicios:
import Services from '../class.services.js'
//importamos el modelo UserMongo con las nuevas :
import persistence from '../../persistence/daos/factory.js';

//importamos utils:
import { createHash, isValidPass } from "../../utils.js";
import { errorsDictionary } from '../../utils/errors.dictionary.js';
import logger from '../../utils/logger/logger.winston.js'



class UserService extends Services {
    constructor() {
        super(persistence.userDao)
        this.cartDao = persistence.cartDao
    }
    createUser = async (userData) => {
        try {console.log('userData services', typeof(userData), userData)
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
                cart : cartId
            })
            if (!newUser) return false;
            //console.log('consola de users.services const createUser:', newUser);
            return newUser;
        } catch (error) {
            logger.error('entró en el catch - users.service - createUser: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
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
                    //const token = generateToken(userExist);
                    //console.log('consola login user service que genera token:', token)
                    //userExist.token = token;
                    return userExist
                }
            }
            return false;
        } catch (error) {
            logger.error('entró en el catch - users.service - login: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_DEFAULT);
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
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
}

const usersServices = new UserService(persistence.userDao);
export default usersServices;

