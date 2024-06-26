import { Router } from 'express';
import productController from '../controllers/products.controller.js';
import sessionController from '../controllers/sessions.controller.js';
import userController from '../controllers/users.controller.js'
import { verifyRole } from '../middlewares/verifyRole.js';
const router = Router();


router.get('/home', (req, res) => {
    res.render('home');
});

//esta vista muestra los productos de lista, más el nombre de usuario y más:
router.get('/productlist', productController.getAllSimple);

/*router.get('/productlist', (req, res)=>{
    res.render('productlist', { user: req.session.passport.user })
})*/ //la desactivo ya que no aporta al momento, algo que visualice


router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/register-success', (req, res) => {
    res.render('registersuccess')
})

router.get('/realtimeproducts', verifyRole, productController.getProductsRealTime);

router.post('/realtimeproducts', verifyRole, productController.createProductsRealTime);

router.get('/registererror', (req, res) => {
    res.render('registererror')
})
router.get('/errorlogin', (req, res) => {
    res.render('errorlogin')
})
router.get('/current', sessionController.profileResponse);

router.get('/profile', (req, res) => {
    res.render('profile', { user: req.session.passport.dto });
})
router.get('/ticket', (req, res) => {
    res.render('ticket')
});
router.get('/solicitudEmail', (req, res) => {
    res.render('solicitudEmail')
});
router.get('/resetPass', (req, res) => {
    res.render('resetPassword')
})
router.get('/soloAdmin', (req, res) => {
    res.render('soloAdmin')
})
export default router;