//import logConfig from "../utils/logger/logger.winston";
import { Router } from "express";

import ejemplo1 from '../utils/logger/test.js'

const router = Router();


router.get('/loggerTest', (req, res)=>{
    ejemplo1();
    res.send('logger test ejecutado');
})


export default router

//aca tengo que seguir leyendo el archivo, pues hay alguna que otra configuración que me faltaría realizar (creo)