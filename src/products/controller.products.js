import { Router } from "express";
import multer from "multer";
import { imgFileFilter, prodImgStorage } from "../utils/multer.utils.js";
import appConfig from "../config/app.config.js";
import { transport } from "../utils/nodemailer.utils.js";
import nodemailerConfig from "../config/nodemailer.config.js";
import { generateProductDeletedWarningMail } from "../mails/productDeletedWarning.js";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteAllProducts } from "./service.products.js";
import { generateProduct } from "../utils/faker.utils.js";
import validateCreationParams from "./validateCreationParams.products.js";
import objectIdRegex from "../utils/objectIdRegex.utils.js";
import uuidRegex from "../utils/uuidRegex.utils.js";
import handlePolicies from "../middlewares/handlePolicies.middleware.js";


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
        req.logger.error(error);
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
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', uploader.array('images'), handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    try {
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
        
        const user = req.user;

        const owner = user.role === 'premium'? user.email : 'admin';

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
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.patch('/:pid', uploader.array('images'), handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    try {
        const user = req.user;
        const { pid } = req.params;
        if(!(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del producto no tiene un formato válido'});
        
        const { name, description, category, code, price, stock } = req.body;
        const Nprice = Number(price);
        const Nstock = Number(stock)
        
        const paramsValidation = validateCreationParams({name, description, category, code, Nprice, Nstock});
        if(!paramsValidation.isValid) return res.status(400).json({status: 'error', message: paramsValidation.message});
        
        if(user.role !== 'admin') {
            const product = await getProductById(pid);
            if(product.payload.owner !== user.email) return res.status(403).json({status: 'error', message: 'No está autorizado a modificar este producto'});
        };

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
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    try {
        const { pid } = req.params;
        if(!(objectIdRegex.test(pid) || uuidRegex.test(pid))) return res.status(400).json({status: 'error', message: 'El id del producto no tiene un formato válido'});

        const user = req.user;
        const product = await getProductById(pid);
    
        if(user.role !== 'admin') {
            if(product.payload.owner !== user.email) return res.status(403).json({status: 'error', message: 'No está autorizado a eliminar este producto'}); 
            const response = await deleteProduct(pid);
            res.json({status: response.status, message: response.message, payload: response.payload});
        };

        if(user.email !== appConfig.test_email) {
            const mailOptions = {
                from: nodemailerConfig.gmail_user,
                to: product.payload.owner,
                subject: 'coderBackend - Alerta: El administrador eliminó su producto',
                html: generateProductDeletedWarningMail(product.payload),
                attachments: []
            };
            await transport.sendMail(mailOptions);
        };

        const response = await deleteProduct(pid);
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
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
        req.logger.error(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/test/mockingProducts', async (req, res) => {
    let mockedProducts = [];
    for(let i = 0; i < 100; i++) {
        mockedProducts.push(generateProduct());
    };
    res.json({status: 'success', message: 'Productos generados', payload: mockedProducts})
});

export default router;