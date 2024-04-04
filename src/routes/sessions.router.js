import { Router } from "express";
import sessionController from '../controllers/sessions.controller.js'
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole2 } from "../middlewares/verifyRole.js";


const router = Router();

router.get('/current',verifyRole2, verifyToken, sessionController.profileResponse);
//acá tiene que ir el método necesario para mostrar los datos del usuario, una vez sea validado el token

/*router.get('/profile', (req, res) => {
    res.render('profile', { user })
});*/
export default router;