import multer from "multer";
import __dirname from "./dirname.utils.js";

export const prodImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/img/products');
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + '-' + file.originalname);
    }
});

export const profImgStorage =  multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/img/users');
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + '-' + file.originalname);
    }
});

export const docStorage =  multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/documents');
    },
    filename: function (req, file, cb) {
        cb(null, 'document-' + Date.now() + '-' + file.originalname);
    }
});

export const imgFileFilter = 
    (req, file, cb) => {
        if(
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png'
        ) {
            cb(null, true);
        } else {
            req.fileTypeError = 'Alguno de los archivos proporcionados no es un tipo de imagen valida. Solo se aceptan las extensiones .jpg y .png.'
            cb(null, false)
        }
};

export const docFileFilter = 
    (req, file, cb) => {
        if(
            file.mimetype === 'application/pdf'
        ) {
            cb(null, true);
        } else {
            req.fileTypeError = 'Solo se permiten archivos de tipo .pdf.'
            cb(null, false)
        }
};