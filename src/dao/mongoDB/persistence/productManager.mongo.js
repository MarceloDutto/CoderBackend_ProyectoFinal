import Product from "../models/product.models.js";

class ProductManager {

    getAll = async (filter, options) => {
        try {
            const data = await Product.paginate(filter, options);
            return data? data : [];
        } catch(error) {
            throw error;
        }
    };

    getById =  async (pid) => {
        try {
            const data = await Product.findById(pid);
            return data? data : {};
        } catch(error) {
            throw error;
        }
    };

    getByQuery = async (query) => {
        try {
            const data = await Product.find(query);
            return data? data : {};
        } catch(error) {
            throw error;
        }
    };

    create = async (productInfo) => {
        try {
            const data = await Product.create(productInfo);
            return data;      
        } catch(error) {
            throw error;
        }
    };

    update = async (pid, updates) => {
        try {
            const data = await Product.findByIdAndUpdate(pid, updates);
            return data;      
        } catch(error) {
            throw error;
        }
    };

    delete = async (pid) => {
        try {
            const data = await Product.findByIdAndDelete(pid);
            return data;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await Product.deleteMany();
            return 'Todos los productos fueron eliminados de la base de datos';
        } catch(error) {
            throw error;
        }
    };
};

export default ProductManager;