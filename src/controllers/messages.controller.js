//importamos clase general:
import Controllers from "./class.controller.js";
//importamos servicios:
import msgService from "../services/messages.service.js";


class MsgController extends Controllers{
    constructor(){
        super(msgService)};
}

const msgController = new MsgController();
export default msgController;