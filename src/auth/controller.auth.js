import { Router } from "express";
import passport from "passport";
import { localAuthentication, externalAuthentication, logout, forgotPassword, resetPassword } from "./service.auth.js";
import { getUserByEmail } from "../users/service.users.js";
import regexEmail from "../utils/emailRegex.utils.js";
import regexToken from "../utils/tokenRegex.utils.js";
import handlePolicies from "../middlewares/handlePolicies.middleware.js";

const router = Router();

router.get('/logout', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    const user = req.user;
    await logout(user.email);

    res.clearCookie('authToken');
    res.redirect('/login');
});

router.get('/github', passport.authenticate('github', {scope: ['user:email'], session: false}));

router.get('/github/callback', passport.authenticate('github', {session: false}), async (req, res) => {
    try {
        const { email } = req.user;
        const response = await externalAuthentication({email: email});
        res.cookie('authToken', response, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: 'Usuario autenticado con Github'});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/google', passport.authenticate('google', {scope: ['profile'], session: false}));

router.get('/google/callback', passport.authenticate('google', {session: false}), async (req, res) => {
    try {
        const { email } = req.user;
        const user = await getUserByEmail(email);
        const response = await externalAuthentication({googleId: user.payload.googleId});
        res.cookie('authToken', response, {maxAge: 900000, httpOnly: true}).json({status: 'success', message: 'Usuario autenticado con Google'});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!regexEmail.test(email)) return res.status(400).json({status: 'error', message: 'El correo electrónico ingresado no es válido'});
        if(typeof password === 'string' && password.trim() === '') return res.status(400).json({status: 'error', message: 'Debe ingresar un tipo de contraseña valido'});

        const response = await localAuthentication(email, password);
        if(response.status === 'error') return res.status(400).json({status: response.status, message: response.message, payload: {}});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;
        if(!regexEmail.test(email)) return res.status(400).json({status: 'error', message: 'El correo electrónico ingresado no es válido'});

        const response = await forgotPassword(email);
        res.json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});



router.post('/resetPassword', async (req, res) => {
    try {
        const { password, token } = req.body;

        if(typeof password === 'string' && password.trim() === '') return res.status(400).json({status: 'error', message: 'Debe ingresar un tipo de contraseña valido'});
        if(!regexToken.test(token)) return res.status(400).json({status: 'error', message: 'Las credenciales de validación no tiene un formato adecuado'});

        const response = await resetPassword(token, password);
        res.json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

export default router;