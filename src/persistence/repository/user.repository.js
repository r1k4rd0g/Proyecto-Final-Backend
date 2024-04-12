import { UserResDTO, UserBasicDataDto } from "../dto/user.res.dto.js";
import persistence from '../daos/factory.js'
import { errorsDictionary } from "../../utils/errors.dictionary.js";
import logger from "../../utils/logger/logger.winston.js";


class UserRepository {
    constructor() {
        this.dao = persistence.userDao
    }
    async getUserById(id) {
        try {
            //console.log('id de consola userRepository:', id)
            const user = await this.dao.getById(id);
            logger.info('user de consola userRepository :' + user)
            if (!user) return false;
            //console.log(`no se encontró usuario buscado por id ${id}`)
            else return new UserResDTO(user);
        } catch (error) {
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
    async getAllUsers() {
        try {
            const users = await this.dao.getAll();
            logger.info('users de userRepository :' + users)
            if (!users) {
                return false
            } else {
                const usersDto = users.map(user => new UserBasicDataDto(user))
                return usersDto;
            }
        } catch (error) {
            throw new Error(error.message, errorsDictionary.ERROR_TO_GET);
        }
    }
}

const userRepository = new UserRepository();
export default userRepository