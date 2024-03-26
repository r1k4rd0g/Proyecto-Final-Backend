import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import usersServices from '../services/users/users.service.js';
import logger from '../utils/logger/logger.winston.js'

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

/* ----------------------------- lógica registro ---------------------------- */
const register = async (req, email, password, done) => {
    try {
        // const { first_name, last_name,... } = req.body
        const user = await usersServices.getByEmail(email);
        if (user) return done(null, false, {message: 'El mail ya está registrado'});
        //console.log('console local-strategy.register, el req.body es un:', typeof req.body, req.body)
        const newUser = await usersServices.createUser(req.body);
        return done(null, newUser);
    } catch (error) {
        logger.error('Entró en catch de local-strategy -> register' + error);
        return done(null, false)
    }
};


/* ------------------------------ lógica login ------------------------------ */
const login = async (req, email, password, done) => {
    try {
        const user = req.body
        //const user = { email, password }
        //console.log('consola local strategy - login que lee user:', user);
        const userLogin = await usersServices.login(user);
        if (!userLogin) return done(null, false, { message: 'User not found' });
        //console.log('Login de local strategy', userLogin);
        return done(null, userLogin);
    } catch (error) {
        logger.error('Entró en catch de local-strategy -> login' + error);
        throw new Error(error.message)
    }
};

/* ------------------------------- strategies ------------------------------- */
const registerStrategy = new LocalStrategy(strategyOptions, register);
const loginStrategy = new LocalStrategy(strategyOptions, login);



/* ----------------------------- inicializacion ----------------------------- */
passport.use('login-local', loginStrategy);
passport.use('register-local', registerStrategy);



/* ------------------------- serialize y deserialize ------------------------ */
//guarda al usuario en req.session.passport
//req.session.passport.user --> id del usuario
passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    //console.log('consola deserializeUser id:', id)
    const user = await usersServices.getById(id);
    return done(null, user);
});
