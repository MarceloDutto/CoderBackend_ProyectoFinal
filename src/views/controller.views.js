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

export default router;