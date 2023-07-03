import { Router } from "express";
import { getCarts, getCartById, createCart, addProductToCart, updateProductsfromCart, updateQuantity, deleteProductfromCart, deleteProductsfromCart, purchaseProductsInCart } from "./service.carts.js";
import { getProductById } from "../products/service.products.js";
import objectIdRegex from "../utils/objectIdRegex.utils.js";
import uuidRegex from "../utils/uuidRegex.utils.js";
import handlePolicies from "../middlewares/handlePolicies.middleware.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const response = await getCarts();
        res.json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error)
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        const response = await getCartById(cid);
        res.json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await createCart();
        res.status(201).json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/:cid/product/:pid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid)) && !(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        const user = req.user;
        if(user.role === 'premium' || user.role === 'admin') {
            const product = await getProductById(pid);
            if(product.payload.owner === user.email) return res.status(400).json({status: 'error', message: 'No se puede agregar al carrito un producto creado por el propio usuario'}); 
        };

        const response = await addProductToCart(cid, pid);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error)
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.put('/:cid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        // validation of content body
        const { products } = req.body;
        if(!(Array.isArray(products) || products.length !== 1)) return res.status(400).json({status: 'error', message: 'La estructura del cuerpo de la solicitud no es válida'});
        let isValid = true;
        for (const prod of products) {
            const { product, quantity } = prod;

            if(!(objectIdRegex.test(product) || uuidRegex.test(product))) {
                isValid = false;
                break;
            } else {
                if(typeof quantity !== 'number' || isNaN(quantity)) {
                    isValid = false;
                    break;
                }
            }
        }
        if(!isValid) return res.status(400).json({status: 'error', message: 'El tipo de los campos no es válido en uno o más elementos'});

        const response = await updateProductsfromCart(cid, products);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.put('/:cid/product/:pid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid)) && !(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        // validation of content body
        const { quantity } = req.body;
        if(typeof quantity !== 'number' || isNaN(quantity)) return res.status(400).json({status: 'error', message: 'La propiedad quantity debe ser un número y no debe estar vacía'});

        const response = await updateQuantity(cid, pid, quantity);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/:cid/product/:pid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid)) && !(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        const response = await deleteProductfromCart(cid, pid);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error)
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/:cid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        const response = await deleteProductsfromCart(cid);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/:cid/purchase', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    try {
        const { cid } = req.params;
        if(!(objectIdRegex.test(cid) || uuidRegex.test(cid))) return res.status(400).json({status: 'error', message: 'El id del carrito no tiene un formato válido'});

        const user = req.user;

        const response = await purchaseProductsInCart(cid, user);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error)
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

export default router;