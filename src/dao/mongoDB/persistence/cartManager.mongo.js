import Cart from "../models/cart.models.js";

class CartManager {

    getAll = async () => {
        try {
            const data = await Cart.find();
            return data? data : []; 
        } catch(error) {
            throw error;
        }
    };

    getById = async (cid) => {
        try {
            const data = await Cart.findOne({_id: cid});
            return data? data : {};     
        } catch(error) {
            throw error;
        }
    };

    create = async () => {
        try {
            const data = await Cart.create({products: []});
            return data;      
        } catch(error) {
            throw error;
        }
    };

    update = async (cid, update) => {
        try {
            const data = await Cart.updateOne({_id: cid}, update);
            return data;
        } catch(error) {
            throw error;
        }
    };

    delete = async (cid) => {
        try {
            const data = await Cart.findByIdAndDelete(cid);
            return data;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await Cart.deleteMany();
            return 'Todos los carritos fueron eliminados de la base de datos';
        } catch(error) {
            throw error;
        }
    };
};

export default CartManager;