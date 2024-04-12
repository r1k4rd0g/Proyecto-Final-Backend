import { Router } from "express";
import sessionController from '../controllers/sessions.controller.js'
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin, verifyRole2 } from "../middlewares/verifyRole.js";


const router = Router();

router.get('/current',verifyRole2, verifyToken, sessionController.profileResponse);

//este endpoint valida si el usuario es admin para dar acceso a otra parte
router.get('/isAdmin', verifyAdmin, verifyToken, (req, res)=>{
    res.sendStatus(200)
});


export default router;