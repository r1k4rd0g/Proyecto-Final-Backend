import { UserModel } from "./users.model.js";
import MongoDao from "../mongo.dao.js";
import { errorsDictionary } from "../../../../utils/errors.dictionary.js";

export default class UserMongoDao extends MongoDao{
    constructor(){
        super(UserModel);
    }

    async create(newUser){
        try {//console.log('consola create users.dao newUser:',newUser)
            const userCreated = await UserModel.create(newUser);
            //console.log('consola de users.dao userCreated:', userCreated)
            return userCreated;
        } catch (error) {
            logger.error('entró en el catch mongodb - users.dao - create: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE);
        }
    }

    async userSearch({email, password}){
        try {//console.log(email, typeof password,'consola de dao')
            const userFind = await UserModel.findOne({email, password})
            //console.log(userFind, 'userFind')
            return userFind;
        } catch (error) {
            logger.error('entró en el catch mongodb - users.dao - userSearch: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_FIND);
        }
    }

    async searchByEmail (email){
        try {//console.log('viene de services en user.dao email: ', email, typeof(email))
            const userFindByEmail = await UserModel.findOne({ email: { $regex: new RegExp(email, 'i') } }); //expresión que hace que sea insensible la busqueda del email ante mayúsucla o minúscula.
            //console.log('consola de users.dao findByEmail: ', userFindByEmail)
            return userFindByEmail
        } catch (error) {
            logger.error('entró en el catch mongodb - users.dao - searchByEmail: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_FIND);
        }
    }
    async searchById (id){
        try {
            return await UserModel.findById(id);
        } catch (error) {
            logger.error('entró en el catch mongodb - users.dao - searchById: ' + error)
            throw new Error (error.message, errorsDictionary.ERROR_TO_FIND);
        }
    }
}

