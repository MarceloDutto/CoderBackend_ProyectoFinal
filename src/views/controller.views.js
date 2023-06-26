import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.redirect('login')
});

router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Registrate',
        style: 'signup.css'
    })
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Iniciar sesión',
        style: 'login.css'
    })
});

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword', {
        title: '¿Olvidaste tu contraseña?',
        style: 'forgot.css'
    })
});

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword', {
        title: 'Cambiar contraseña',
        style: 'reset.css'
    })
});

export default router;