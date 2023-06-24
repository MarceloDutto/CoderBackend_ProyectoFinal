import { Router } from "express";
import multer from "multer";
import { imgFileFilter, prodImgStorage } from "../utils/multer.utils.js";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteAllProducts } from "./service.products.js";
import validateCreationParams from "./validateCreationParams.products.js";
import objectIdRegex from "../utils/objectIdRegex.utils.js";
import uuidRegex from "../utils/uuidRegex.utils.js";


const router = Router();
const uploader = multer({storage: prodImgStorage, fileFilter: imgFileFilter});

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const query = req.query.query || null;
        const sort = req.query.sort || null;

        const response = await getProducts(limit, page, query, sort);
        res.json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if(!(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del producto no tiene un formato válido'});

        const response = await getProductById(pid);
        res.json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', uploader.array('images'), async (req, res) => {
    try {
        //condicion para subir archivos
        const { name, description, category, code, price, stock } = req.body;
        if(!name || !description || !category || !code || !price || !stock) return res.status(400).json({status: 'error', message: 'Debes completar los campos requeridos.'});
        const Nprice = Number(price);
        const Nstock = Number(stock);
        
        const paramsValidation = validateCreationParams({name, description, category, code, Nprice, Nstock});
        if(!paramsValidation.isValid) return res.status(400).json({status: 'error', message: paramsValidation.message});

        if(req.fileTypeError) return res.status(400).json({status: 'error', message:req.fileTypeError}); // multer files validation

        let thumbnail = [];

        // Check if the files uploaded with multer have .jpg or .png extensions and store them
        if(req.files && req.files.length !== 0) {
            const files = req.files;

            files.forEach(file => {
                if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
                    let path = `/img/products/${file.filename}`;
                    thumbnail.push(path);
                }
            });
        };
        
        const owner = 'user'
        // TO DO: Set owner to user.email or user.id

        const productInfo = {
            name, 
            description,
            category,
            code,
            price: Nprice,
            thumbnail,
            stock: Nstock,
            owner
        };

        const response = await createProduct(productInfo);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});

    } catch(error) {
        console.log(error)
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.patch('/:pid', uploader.array('images'), async (req, res) => {
    try {
        // TO DO: Only an owner or an admin can update a product
        
        //condicion para subir archivos
        const { pid } = req.params;
        if(!(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del producto no tiene un formato válido'});

        const { name, description, category, code, price, stock } = req.body;
        const Nprice = Number(price);
        const Nstock = Number(stock)

        const paramsValidation = validateCreationParams({name, description, category, code, Nprice, Nstock});
        if(!paramsValidation.isValid) return res.status(400).json({status: 'error', message: paramsValidation.message});

        if(req.fileTypeError) return res.status(400).json({status: 'error', message:req.fileTypeError}); // multer files validation
        
        let thumbnail = [];

        // Check if the files uploaded with multer have .jpg or .png extensions and store them
        if(req.files && req.files.length !== 0) {
            const files = req.files;

            files.forEach(file => {
                if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
                    let path = `/img/products/${file.filename}`;
                    thumbnail.push(path);
                }
            });
        };

        const updates = {
            name,
            description,
            category,
            code,
            price: Nprice,
            thumbnail,
            stock: Nstock
        };

        const response = await updateProduct(pid, updates);
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if(!(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del producto no tiene un formato válido'});
    
        // TO DO: Only an owner or an admin can delete a product
        // TO DO: in case of admin deletion of product that had a premium owner, it sends an email with a warning
        
        const response = await deleteProduct(pid);
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

//********************************************//
// For development and testing purposes.
router.delete('/', async (req, res) => {
    try {
        const response = await deleteAllProducts();
        res.json({status: 'success', message: response.message});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

export default router;