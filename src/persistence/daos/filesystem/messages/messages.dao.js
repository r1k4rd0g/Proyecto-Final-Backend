
import fs from 'fs';
import logger from '../../../../utils/logger/logger.winston.js'

export default class MessageFSDao {
    constructor(path) {
        this.path = path;
    }

    async createMsg(obj) {
        try {
            const msg = {
                id: await this.#getMaxId() + 1,
                ...obj
            }
            const msgFile = await this.getAll();
            msgFile.push(msg);
            await fs.promises.writeFile(this.path, JSON.stringify(msgFile));
            return msg;
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - createMsg' + error);
        }
    }

    async #getMaxId() {
        let maxId = 0;
        const msgs = await this.getAll();
        msgs.map((msg) => {
            if (msg.id > maxId) maxId = msg.id;
        });
        return maxId;
    }

    async getAll() {
        try {
            if (fs.existsSync(this.path)) {
                const msgs = await fs.promises.readFile(this.path, 'utf8');
                const msgsJS = JSON.parse(msgs);
                return msgsJS;
            } else {
                return []
            }
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - getAll' + error);
            throw new Error (error)
        }
    }

    async getById(id) {
        try {
            const msgsFile = await this.getAll()
            const msg = msgsFile.find((sms) => sms.id === id)
            if (msg) {
                return msg
            }
            return false
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - getById' + error);
            throw new Error (error)
        }
    }

    async updateMsg(obj, id) {
        try {
            const msgsFile = await this.getAll();
            const index = msgsFile.findIndex(msg => msg.id === id)
            if (index === -1) {
                throw new Error(`Id ${id} not found`)
            } else {
                msgsFile[index] = { ...obj, id };
            }
            await fs.promises.writeFile(this.path, JSON.stringify(msgsFile));
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - createMsg' + error);
            throw new Error (error)
        }
    }

    async deleteMsg(id) {
        try {
            const msgsFile = await this.getAll()
            if (msgsFile.length > 0) {
                const newArray = msgsFile.filter(m => m.id !== id)
                await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            } else {
                throw new Error(`Msg not found`)
            }
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - deleteMsg' + error);
            throw new Error (error)
        }
    }

    async deleteMsgs() {
        try {
            if (fs.existsSync(this.path)) {
                await fs.promises.unlink(this.path)
            }
        } catch (error) {
            logger.error('Entró en catch de fs - messages.dao - deleteMsgs' + error);
            throw new Error (error)
        }
    }
}
