import { Router } from "express";
import passport from "passport";
import { localAuthentication, externalAuthentication, logout } from "./service.auth.js";
import { getUserByEmail } from "../users/service.users.js";
import regexEmail from "../utils/emailRegex.utils.js";

const router = Router();

router.get('/logout', async (req, res) => {
    res.json({message: 'endpoint de logout'});
});

router.get('/github', passport.authenticate('github', {scope: ['user:email'], session: false}));

router.get('/github/callback', passport.authenticate('github', {session: false}), async (req, res) => {
    try {
        const { email } = req.user;
        const response = await externalAuthentication({email: email});
        res.cookie('authToken', response, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: 'Usuario autenticado con Github'});
    } catch(error) {
        console.log(error);
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

        //TO DO: validar lo que viene del body

        const response = await localAuthentication(email, password);
        if(response.status === 'error') return res.status(400).json({status: response.status, message: response.message, payload: {}});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: response.message});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});



router.put('/', async (req, res) => {
    res.json({message: 'auth PUT'});
});

router.patch('/', async (req, res) => {
    res.json({message: 'auth PATCH'});
});

router.delete('/', async (req, res) => {
    res.json({message: 'auth DELETE'});
});

export default router;