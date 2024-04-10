import { Router } from "express";
import sessionController from '../controllers/sessions.controller.js'
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole2 } from "../middlewares/verifyRole.js";


const router = Router();

router.get('/current',verifyRole2, verifyToken, sessionController.profileResponse);



export default router;