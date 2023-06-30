import fs from 'fs';
import UserManager from "../dao/mongoDB/persistence/userManager.mongo.js";
import { createCart, deleteCart } from "../carts/service.carts.js";
import { createHash } from "../utils/bcrypt.utils.js";
import { generateToken } from '../utils/jwt.utils.js';
import userDTO from "../DTOs/user.dto.js";
import __dirname from '../utils/dirname.utils.js';
import appConfig from "../config/app.config.js";


const um = new UserManager();

export const getUsers = async () => {
    try {
        const data = await um.getAll();
        if(data.length === 0) return {message: 'La base de datos no contiene usuarios', payload: []};

        const mappedData = data.map(doc => new userDTO(doc));
        return {message: 'Usuarios encontrados', payload: mappedData};
    } catch(error) {
        throw error;
    }
};

export const getUserById = async (uid) => {
    try {
        const data = await um.getById(uid);
        if(Object.keys(data).length === 0) return {message: 'Usuario no encontrado en la base de datos', payload: {}};
        
        return {message: 'Usuario encontrado', payload: data};
    } catch(error) {
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const data = await um.getByQuery({email: email});
        if(Object.keys(data).length === 0) return {message: 'Usuario no encontrado en la base de datos', payload: {}};

        return {message: 'Usuario encontrado', payload: data};
    } catch(error) {
        throw error;
    }
};

export const getUserByQuery = async (query) => {
    try {
        const data = await um.getByQuery(query);
        if(Object.keys(data).length === 0) return {message: 'Usuario no encontrado en la base de datos', payload: {}};
        
        return {message: 'Usuario encontrado', payload: data};
    } catch(error) {
        throw error;
    }
};

export const createUser = async (userInfo) => {
    try {
        const { first_name, last_name, age, profile_picture, email, password, googleId } = userInfo;

        const user = await getUserByEmail(email);
        if(Object.keys(user.payload).length !== 0) return {statusCode: 400, status: 'error', message: 'Ya existe un usuario regitrado con el mismo email', payload: {}};

        const userCart = await createCart();

        let pass = ''
        if(password !== '') {
            pass = createHash(password);
        }; 

        let role = 'user';
        if(email === appConfig.test_email) {
            role = 'admin'
        };

        const newUserInfo = {
            first_name,
            last_name,
            age,
            profile_picture,
            email,
            password: pass,
            role,
            googleId: googleId? googleId : '',
            cart: userCart.payload.id,
            last_connection: new Date()
        };

        const data = await um.create(newUserInfo);
        const newUser = new userDTO(data);
        return {statusCode: 201, status: 'success', message: 'Usuario registrado exitosamente', payload: newUser};
    } catch(error) {
        throw error;
    }
};

export const updateUser = async (uid, update) => {
    try {
        const data = await um.update(uid, update);
        const updatedUser = new userDTO(data);
        const changes = new userDTO(update);
        return {status: 'success', message: 'Usuario actualizado con éxito', payload: {originalUser: updatedUser, update: changes }};
    } catch(error) {
        throw error;
    }
};

export const changeUserRole = async (uid) => {
    try {
        const user = await um.getById(uid);
        if(Object.keys(user).length === 0) return {status: 'error', message: 'Usuario no encontrado en la base de datos', payload: {}};

        switch (user.role) {
            case 'user':
                const docs = [];
                user.documents.forEach(doc => {
                    docs.push(doc.name);
                });

                if(docs.includes('identification' && 'proofOfAddress' && 'bankStatement')) {
                    user.role = 'premium';
                } else {
                    return {status: 'error', message: 'No se ha terminado de procesar la documentación necesaria. Revise los requisitos.', payload: {}};
                };
                break;
            case 'premium':
                user.role = 'user';
                break;
        };

        const updatedUser = await updateUser(uid, user);

        const userData = {
            first_name: updatedUser.payload.update.first_name,
            last_name: updatedUser.payload.update.last_name,
            fullname: updatedUser.payload.update.first_name + ' ' + updatedUser.payload.update.last_name,
            email: updatedUser.payload.update.email,
            cart: updatedUser.payload.update.cart,
            role: updatedUser.payload.update.role
        };
        let token = generateToken({ userData }, '15m');
        
        return {status: 'success', message: `${updatedUser.message} El rol del usuario ahora es ${user.role.toUpperCase()}.`, payload: updatedUser.payload, token};
    } catch(error) {
        throw error;
    }
};

export const uploadDocumentation = async (uid, files) => {
    try {
        const { idFile, addressFile, accountFile } = files;

        const user = await um.getById(uid);
        if(Object.keys(user).length === 0) return {status: 'error', message: 'Usuario no encontrado en la base de datos', payload: {}};

        const uploadedDocuments = [];
        
        // if file is uploaded, replaces the previous one in the same category
        if(idFile) {
            const docs = user.documents;

            for(let i=0; i < docs.length; i++) {
                let doc = docs[i];

                if(doc.name === 'identification') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(__dirname + doc.reference);
                }
            };
            const path = `/documents/${idFile.filename}`;
            const document = {
                name: 'identification',
                reference: path
            }
            user.documents.push(document);
            uploadedDocuments.push(document.name);
        };

        if(addressFile) {
            const docs = user.documents;

            for(let i=0; i < docs.length; i++) {
                let doc = docs[i];

                if(doc.name === 'proofOfAddress') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(__dirname + doc.reference);
                }
            };

            const path = `/documents/${addressFile.filename}`;
            const document = {
                name: 'proofOfAddress',
                reference: path
            }
            user.documents.push(document);
            uploadedDocuments.push(document.name);
        };

        if(accountFile) {
            const docs = user.documents;

            for(let i=0; i < docs.length; i++) {
                let doc = docs[i];

                if(doc.name === 'bankStatement') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(__dirname + doc.reference);
                }
            };

            const path = `/documents/${accountFile.filename}`;
            const document = {
                name: 'bankStatement',
                reference: path
            }
            user.documents.push(document);
            uploadedDocuments.push(document.name);

        };

        const updatedUser = await updateUser(uid, user);
        return {status: 'success', message: `${updatedUser.message} Documentación cargada con éxito.`, payload: {uploadedDocuments: uploadedDocuments}};
    } catch(error) {
        throw error;
    }
};

export const deleteUser = async (uid) => {
    try {

        const user = await um.getById(uid);
        if(Object.keys(user).length === 0) return {status: 'error', message: 'Usuario no encontrado en la base de datos', payload: {}};

        // Delete user cart
        await deleteCart(user.cart);

        // Delete user profile picture file 
        if(user.profile_picture !== `/img/users/profilePlaceholder.png`) {
            const path = user.profile_picture;
            if(fs.existsSync(__dirname + `/public` + path)) {
                fs.unlink(__dirname + `/public` + path, (error) => {
                    if(error) {
                        throw error;
                    }
                })
            }
        };

        // Delete documentation files related to the user
        user.documents.forEach(doc => {
            const path = doc.reference;
            if(fs.existsSync(__dirname + path)) {
                fs.unlink(__dirname + path, (error) => {
                    if(error) {
                        throw error;
                    }
                })
            }
        });
        
        const data = await um.delete(uid);
        const deletedUser = new userDTO(data);
        return {status: 'success', message: 'Usuario eliminado de la base de datos', payload: deletedUser};
    } catch(error) {
        throw error;
    }
};

export const deleteOutdatedUsers = async () => {
    try {
        const data = await um.getAll();
        if(data.length === 0) return {status: 'error', message: 'La base de datos no contiene usuarios registrados', payload: []};

        const timeFrame = 172800; // cantidad de segundos en dos días
        let outdatedUsers = [];

        data.forEach(user => {
            const userConnection = user.last_connection;
            const currentTime = new Date();
            const timeLimit = new Date(userConnection.getTime() + timeFrame * 1000); //Convierte los valores a milisegundos para poder comparar con la fecha actual

            if(currentTime > timeLimit) {
                outdatedUsers.push(user);
            }
        });

        if(outdatedUsers.length === 0) return {status: 'success', message: 'No se encontraron usuarios sin conexión reciente', payload: []};
        
        for (const user of outdatedUsers) {
            await deleteUser(user.id)
        };
        const deletedUsers = data.map(doc => new userDTO(doc));
        return {status: 'success', message: 'Usuarios sin conexión reciente eliminados', payload: deletedUsers};
    } catch(error) {
        throw error;
    }
};