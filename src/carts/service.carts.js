import __dirname from '../utils/dirname.utils.js';
import { cartsDAO } from '../dao/factory.dao.js';
import { getProductById, updateProduct } from "../products/service.products.js";
import { createTicket } from "../tickets/service.tickets.js";
import cartDTO from "../DTOs/cart.dto.js";

const cm = cartsDAO;

export const getCarts = async () => {
    try {
        const data = await cm.getAll();
        if(data.length === 0) return {message: 'La base de datos no contiene carritos', payload: []};
        const carts = data.map(doc => new cartDTO(doc));
        return {message: 'Carritos encontrados', payload: carts};
    } catch(error) {
        throw error;
    }
};

export const getCartById = async (cid) => {
    try {
        const data = await cm.getById(cid);
        if(Object.keys(data).length === 0) return {message: 'Carrito no encontrado en la base de datos', payload: {}};
        const cart = new cartDTO(data)
        return {message: 'Carrito encontrado en la base de datos', payload: cart};
    } catch(error) {
        throw error;
    }
};

export const createCart = async () => {
    try {
        const data = await cm.create();
        const newCart = new cartDTO(data)
        return {message: 'El carrito fue creado correctamente en la base de datos', payload: newCart};
    } catch(error) {
        throw error;
    }
};

export const addProductToCart = async (cid, pid) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        const product = await getProductById(pid);
        if(Object.keys(product.payload).length === 0) return {statusCode: 400, status: 'error', message: 'Producto no encontrado en la base de datos', payload: {}};

        const prodIndex = cart.products.findIndex(prod => {
            if(typeof prod.product === 'string') {
                return prod.product === pid;
            } else {
                return prod.product.equals(pid);
            }
        });

        if(prodIndex !== -1) {
            cart.products[prodIndex].quantity++;
            const update = await cm.update(cid, cart);
            return {statusCode: 200, status: 'success', message: 'Producto del carrito modificado con éxito', payload: update};
        } else {
            cart.products.push({product: pid, quantity: 1});
            await cm.update(cid, cart);
            return {statusCode: 200, status: 'success', message: 'Producto agregado al carrito', payload: product};
        }
    } catch(error) {
        throw error;
    }
};

export const updateProductsfromCart = async (cid, products) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        let invalidProducts = [];

        for(let i; i > products.length; i++) {
            try {
                let id = products[i].product.id;
                const response = await getProductById(id);
                if(Object.keys(response).length !== 0) invalidProducts.push(response);
            } catch(error) {
                throw error;
            }
        };

        if(invalidProducts.length === 0) {
            cart.products = products;
            await cm.update(cid, cart);
            return {statusCode: 200, status: 'success', message: 'Productos del carrito actualizados', payload: cart};
        } else {
            return {statusCode: 400, status: 'error', message: 'Error al actualizar. Algunos productos no se encontraron en la base de datos.', payload: invalidProducts};
        }
    } catch(error) {
        throw error;
    }
};

export const updateQuantity = async (cid, pid, quantity) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        if(cart.products.length === 0) return {statusCode: 400, status: 'error', message: 'El carrito no contiene productos', payload: {}};

        const prodIndex = cart.products.findIndex(prod => {
            if(typeof prod.product === 'string') {
                return prod.product === pid;
            } else {
                return prod.product.equals(pid);
            }
        });
        if(prodIndex === -1) return {statusCode: 400, status: 'error', message: 'El producto no se encontró en el carrito', payload: {}};

        cart.products[prodIndex].quantity = quantity;
        const update = await cm.update(cid, cart);
        return {statusCode: 200, status: 'success', message: 'Cantidad actualizada', payload: update};
    } catch(error) {
        throw error;
    }
};

export const deleteProductfromCart = async (cid, pid) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        if(cart.products.length === 0) return {statusCode: 400, status: 'error', message: 'El carrito no contiene productos', payload: {}};

        const prodIndex = cart.products.findIndex(prod => {
            if(typeof prod.product === 'string') {
                return prod.product === pid;
            } else {
                return prod.product.equals(pid);
            }
        });
        if(prodIndex === -1) return {statusCode: 400, status: 'error', message: 'El producto no se encontró en el carrito', payload: {}};

        cart.products.splice(prodIndex, 1);
        await cm.update(cid, cart);
        return {statusCode: 200, status: 'success', message: 'Producto eliminado del carrito', payload: {}};
    } catch(error) {
        throw error;
    }
};

export const deleteProductsfromCart = async (cid) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        if(cart.products.length === 0) return {statusCode: 400, status: 'error', message: 'El carrito no contiene productos', payload: {}};

        cart.products = [];
        await cm.update(cid, cart);
        return {statusCode: 200, status: 'success', message: 'Todos los productos fueron eliminandos del carrito', payload: {}};
    } catch(error) {
        throw error;
    }
};

export const purchaseProductsInCart = async (cid, purchaser) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {statusCode: 400, status: 'error', message: 'Carrito no encontrado en la base de datos', payload: {}};

        if(cart.products.length === 0) return {statusCode: 400, status: 'error', message: 'El carrito no contiene productos', payload: {}};

        let allowedProducts = [];
        let rejectedProducts = [];
        let processedProductIds = [];
        let productsInCart = []

        for(let prod of cart.products) {
            let info = await getProductById(prod.product);
            let data = {
                product: {...info.payload},
                quantity: prod.quantity
            }
            productsInCart.push(data);
        };
        
        for (let prod of productsInCart) {
            let id = prod.product.id;
            let price = prod.product.price;
            let quantity = prod.quantity;

            const product = await getProductById(id);

            if(Object.keys(product.payload).length === 0) {
                rejectedProducts.push(id);
                continue;
            };

            if(quantity <= product.payload.stock) {
                try {
                    await updateProduct(id, {stock: product.payload.stock - quantity});
                    const subtotal = price * quantity;
                    const item = {
                        item: {
                            name: product.payload.name,
                            quantity
                        },
                        subtotal
                    };
                    allowedProducts.push(item);
                    processedProductIds.push(id);
                } catch(error) {
                    throw error;
                }
            } else {
                rejectedProducts.push(id)
            }
        };
        
        if(allowedProducts.length === 0) return {statusCode: 400, status: 'error', message: 'La compra no pudo realizarse. Revise el stock antes de comprar.', payload: {rejectedProducts: rejectedProducts}};
        
        cart.products = productsInCart.filter(prod => !processedProductIds.includes(prod.product.id));
        await cm.update(cid, cart);

        const amount = allowedProducts.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.subtotal;
        }, 0);

        const ticketInfo = {
            products: allowedProducts,
            amount,
            purchaser: purchaser.fullname
        };

        console.log(ticketInfo)

        const purchaseTicket = await createTicket(ticketInfo);
        if(rejectedProducts.length > 0) return {statusCode: 200, status: 'success', message: 'Algunos productos de tu carrito no tienen stock. La compra fue realizada exitosamente con los productos disponibles', payload: purchaseTicket};

        return {statusCode: 200, status: 'success', message: 'La compra fue realizada exitosamente', payload: purchaseTicket};
    } catch(error) {
        throw error;
    }
};

// For internal application use
export const deleteCart = async (cid) => {
    try {
        const cart = await cm.getById(cid);
        if(Object.keys(cart).length === 0) return {status: 'error', message: 'Carrito no encontrado en la base de datos'};

        await cm.delete(cid);
        return {status: 'success', message: 'Carrito eliminado'}
    } catch(error) {
        throw error;
    }
};