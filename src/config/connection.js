import { connect } from "mongoose";
import config from '../config/config.js'
import logger from "../utils/logger/logger.winston.js";

export const connectionURL = config.MONGO_URL;

export class ConnectMongoDB {
    static #instance;
    constructor() {
        connect(connectionURL);
    }

    static getInstance() {
        if (this.#instance) {
            logger.info("ya estamos conectados a MongoDB");
            return this.#instance;
        } else {
            this.#instance = new ConnectMongoDB();
            logger.info("Conectados a MongoDB")
            return this.#instance;
        }
    }
}