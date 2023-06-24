import { Router } from "express";
import multer from "multer";
import { getUsers, getUserById, createUser, uploadDocumentation, changeUserRole, deleteUser, deleteOutdatedUsers } from "./service.users.js";
import { imgFileFilter, profImgStorage, docStorage, docFileFilter } from "../utils/multer.utils.js";
import validateCreationParams from "./validateCreationParams.users.js";
import objectIdRegex from "../utils/objectIdRegex.utils.js";
import uuidRegex from "../utils/uuidRegex.utils.js";

const router = Router();
const imgUploader = multer({storage: profImgStorage, fileFilter: imgFileFilter});
const docUploader = multer({storage: docStorage, fileFilter: docFileFilter}).fields([
    {name: 'identity', maxCount: 1},
    {name: 'address', maxCount: 1},
    {name: 'account', maxCount: 1}
]);

router.get('/', async (req, res) => {
    try {
        const response = await getUsers();
        res.json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.get('/premium/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        if(!(objectIdRegex.test(uid) || uuidRegex.test(uid))) return res.status(400).json({status: 'error', message: 'El id del usuario no tiene un formato válido'});
    
        const response = await changeUserRole(uid)
        // create cookie with new user data and delete the old one
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/', imgUploader.single('image'), async (req, res) => {
    try {
        //condicion para subir archivos
        const { first_name, last_name, age, email, password } = req.body;
        if(!first_name || !last_name || !age || !email || !password) return res.status(400).json({status: 'error', message: 'Debes completar los campos requeridos'});
        const Nage = Number(age);
    
        // Revisar validacion
        const paramsValidation = validateCreationParams({first_name, last_name, Nage, email, password});
        if(!paramsValidation.isValid) return res.status(400).json({status: 'error', message: paramsValidation.message});
    
        if(req.fileTypeError) return res.status(400).json({status: 'error', message:req.fileTypeError}); // multer files validation
    
        let profPicture = `/img/users/profilePlaceholder.png`;
    
        // Check if the file uploaded with multer have .jpg or .png extensions and store it
        if(req.file) {
            const files = req.file;
            if(files.mimetype === 'image/jpeg' || files.mimetype === 'image/png' ) {
                profPicture = `/img/users/${files.filename}`;
            }
        };
    
        const userInfo = {
            first_name,
            last_name,
            age: Nage,
            profile_picture: profPicture,
            email,
            password
        };

        const response = await createUser(userInfo);
        res.status(response.statusCode).json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.post('/:uid/documents', docUploader, async (req, res) => {
    try {
        //condicion para subir archivos
        const { uid } = req.params;
        if(!(objectIdRegex.test(uid) || uuidRegex.test(uid))) return res.status(400).json({status: 'error', message: 'El id del usuario no tiene un formato válido'});

        if(req.fileTypeError) return res.status(400).json({status: 'error', message:req.fileTypeError}); // multer files validation

        const idFile = req.files['identity']? req.files['identity'][0] : null;
        const addressFile = req.files['address']? req.files['address'][0] : null;
        const accountFile = req.files['account']? req.files['account'][0] : null;

        // Check if there are files uploaded with multer
        if(!idFile && !addressFile && !accountFile) return res.status(400).json({status: 'error', message: 'No se han seleccionado documentos para cargar'});
        
        const files = {
            idFile,
            addressFile,
            accountFile
        };

        const response = await uploadDocumentation(uid, files);
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/', async (req, res) => {
    try {
        const response = await deleteOutdatedUsers();
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        if(!(objectIdRegex.test(uid) || uuidRegex.test(uid))) return res.status(400).json({status: 'error', message: 'El id del usuario no tiene un formato válido'});

        const response = await deleteUser(uid);
        res.json({status: response.status, message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error interno del servidor', error});
    }
});

export default router;