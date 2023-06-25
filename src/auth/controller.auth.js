import { Router } from "express";
import passport from "passport";
import { localAuthentication, externalAuthentication, logout } from "./service.auth.js";

const router = Router();

router.get('/logout', async (req, res) => {
    res.json({message: 'endpoint de logout'});
});

router.get('/github', passport.authenticate('github', {session: false}));

router.get('github/callback', passport.authenticate('github', {session: false}), async (req, res) => {
    try {
        console.log(req.user);

        const { email } = req.user;
        const response = await externalAuthentication({email: email});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: 'Usuario autenticado con Github'});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/google', passport.authenticate('google', {session: false}));

router.get('google/callback', passport.authenticate('google', {session: false}), async (req, res) => {
    try {
        console.log(req.user);

        const { googleId } = req.user;
        const response = await externalAuthentication({googleId: googleId});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: 'Usuario autenticado con Github'});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

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