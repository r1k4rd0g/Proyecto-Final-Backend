import UserResDTO from "../dto/user.res.dto.js";
import persistence from '../daos/factory.js'
import { errorsDictionary } from "../../utils/errors.dictionary.js";

class UserRepository {
    constructor(){
        this.dao= persistence.userDao
    }
    async getUserById(id) {
        try {
            //console.log('id de consola userRepository:', id)
            const user = await this.dao.getById(id);
            //console.log('user de consola userRepository:', user)
        if(!user) return false;
        //console.log(`no se encontró usuario buscado por id ${id}`)
        else return new UserResDTO(user);
        } catch (error) {
            throw new Error (error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
}

const userRepository = new UserRepository();
export default userRepository