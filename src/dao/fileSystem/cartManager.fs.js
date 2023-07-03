import fs, { existsSync, promises, writeFile } from 'fs'
import { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor (path) {
        this.carts = [];
        this.path = path;
    };

    getAll = async () => {
        try {
            if(!existsSync(this.path)) {
                return [];
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return [];
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;
        } catch(error) {
            throw error;
        }
    };

    getById = async (cid) => {
        try {
            if(!existsSync(this.path)) {
                return {};
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            const cartById = this.carts.find(cart => cart.id === cid);
            return cartById ? cartById : {};
        } catch(error) {
            throw error;
        }
    };

    create = async () => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.carts = JSON.parse(data);
                } else {
                    this.carts = [];
                };
            } else {
                this.carts = [];
            };
            
            let id;
            let unique = false;
            while(!unique) {
                id = uuidv4();
                unique = !this.carts.some(cart => cart.id === id);
            };

            const newCart = {
                id,
                products: []
            };

            this.carts.push(newCart);
            const cartsStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartsStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newCart;
        } catch(error) {
            throw error;
        }
    };

    update = async (cid, update) => {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);

            const indexById = this.carts.findIndex(cart => cart.id === cid);
            this.carts[indexById] = update;
    
            const cartsStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartsStr, error => {
                if(error) {
                    throw error;
                }
            });
            
            return update;
        } catch(error) {
            throw error;
        }
    };

    delete = async (cid) => {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);

            const indexById = this.carts.findIndex(cart => cart.id === cid);
            const cart = this.carts[indexById];

            this.carts.splice(indexById, 1);

            const cartsStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartsStr, error => {
                if(error) {
                    throw error;
                }
            });
            
            return cart;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            if(!existsSync(this.path)) return 'No existe el archivo';

            this.carts = [];
            const cartsStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartsStr, error => {
                if(error) {
                    throw error;
                }
            });
            return 'Todos los carritos fueron eliminados';
        } catch(error) {
            throw error;
        }
    };
};

export default CartManager;