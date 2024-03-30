//importamos class Generic:
import usersServices from "../services/users/users.service.js";
import userRepository from "../persistence/repository/user.repository.js";
import Controllers from "./class.controller.js";
import logger from  '../utils/logger/logger.winston.js'

class SessionController extends Controllers {
    constructor(){
        super(usersServices)
        this.userRepository = userRepository
    }

    profileResponse = async (req, res, next) =>{
        try {
            logger.info('consola req.user en sessions controller:'+ req.user)
            const userLog = req.session.passport.user;
            const id = userLog._id
            logger.debug('id buscado de userLog'+ id)
            const user = await userRepository.getUserById(id);
            //console.log('consola user de profileResponse', user) //el dato llega modificado
            req.session.passport.dto = user;
            //se guarda modificado?
            console.log('consola 23 user session dto', req.session.passport.dto)
            res.json(user);
            //res.render('profile', {user: user});
            //return user
        } catch (error) {
            logger.error('Entró al catch en profileResponse'+ error)
            next (error);
        }
    }

}


const sessionController = new SessionController();
export default sessionController


