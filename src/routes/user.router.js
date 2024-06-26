import { Router } from "express";
import userController from "../controllers/users.controller.js";
import passport from "passport";
import { verifyAdmin } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();

router.get('/allUsers', verifyAdmin, userController.getAllUsers); // Get all users as admin with DTO

router.get('/productlist', (req, res) => {
    res.render('productlist', { user: req.session.passport.user });
}); //con esta vista renderizo y muestro los datos del usuario registrado.

router.post("/register", passport.authenticate('register-local', {
    successRedirect: '/register-success',
    failureRedirect: '/registererror'
}));

//con esta vista genero el logueo local:
router.post("/login", passport.authenticate("login-local"), userController.loginResponse)


router.get("/github-register", passport.authenticate("github-register", {
    failureRedirect: "/registererror", //en caso de que haya error, nos manda al login nuevamente.
    successRedirect: "/register-success", //en caso de que no haya error, entonces renderizamos la vista que queremos ver..
    passReqToCallback: true
}));

//Para login con Git ambas rutas, get y post deben estar activas:
router.get("/github-login", passport.authenticate("github-login"), userController.loginResponse);

router.post("/github-login", passport.authenticate("github-login"), userController.loginResponse);

router.post('/logout', userController.logout);
export default router;

//ruta para actualizar el role de un usuario:
router.put('/premium/:id', verifyToken, userController.update)

//ruta para solicitar nueva contraseña
router.post('/reset-pass', userController.solicitudResetPass)

//verificar el token para cambiar el pass
router.post('/verifyToken', userController.verifyToken)

//ruta para actualizar contraseña
router.put('/new-pass', userController.newPass)

//borra los usuarios con un tiempo de inactividad
router.delete('/deleteUsers', verifyAdmin, userController.deleteUsers)