import { Router } from "express";
import { getProducts } from "../products/service.products.js"; // va?
import { getCartById } from "../carts/service.carts.js";

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/products')
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

router.get('/profile', (req, res) => {
    //const user = req.user;
    res.render('profile', {
        title: 'Perfil',
        style: 'profile.css',
        // user
    })
});

router.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;
        const query = req.query.query || null;
        const sort = req.query.sort || null;
        let products = [];
        let showProducts = false;
    
        const data = await getProducts(limit, page, query, sort);
        products = data.payload.payload;

        if(products.length > 0) showProducts = true;
    
        res.render('products', {
            title: 'Productos',
            style: 'products.css',
            showProducts,
            products,
            prevPageLink: data.payload.hasPrevPage? data.payload.prevLink : '', 
            nextPageLink: data.payload.hasNextPage? data.payload.nextLink : ''
        });
    } catch(error) {
        console.log(error);
        res.render('products', {
            title: 'Productos',
            style: 'products.css',
            showProducts
        })
    }   
});

router.get('/products/details/:pid', async (req, res) => {
    res.render('productDetails', {
        title: 'Detalles del producto',
        style: 'productDetails.css'
    });
});

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    let showProducts = false;
    let amount;

    try {
        const data = await getCartById(cid);
        const cart = data.payload;
        let products = cart.products
        if(products.length > 0) {
            showProducts = true;
            const total = products.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.product.price * currentValue.quantity);
            }, 0);

            amount = total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }    

        res.render('cart', {
            title: 'Mi carrito',
            style: 'cart.css',
            showProducts,
            products: products.map(prod => prod.toJSON()),
            cart,
            amount
        });
    } catch(error) {
        console.log(error);
        res.render('cart', {
            showProducts,
            style: 'cart.css'
        });
    }
});

router.get('/admin', (req, res) => {
    res.render('users', {
        title: 'Panel de usuarios',
        style: 'users.css'
    })
});

export default router;