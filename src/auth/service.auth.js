import { getUserByEmail, getUserByQuery, updateUser } from "../users/service.users.js";
import { createHash, isValidPassword } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
import nodemailerConfig from "../config/nodemailer.config.js";
import { transport } from "../utils/nodemailer.utils.js";
import { generateResetPasswordMail } from "../mails/resetPassword.mail.js";

export const localAuthentication = async (email, password) => {
    try {
        const data = await getUserByEmail(email);
        const user = data.payload;
        if(Object.keys(user).length === 0 || !isValidPassword(user, password)) return {status: 'error', message: 'El usuario y la contraseña no coinciden', payload: {}};

        user.last_connection = new Date();
        await updateUser(user.id, user);

        const userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            fullname: user.first_name + ' ' + user.last_name,
            avatar: user.profile_picture,
            email,
            cart: user.cart,
            role: user.role
        };

        let token = generateToken({ userData } , '15m');
        return {status: 'success', message: 'Usuario autenticado', payload: token};
    } catch(error) {
        throw error;
    }
};

export const externalAuthentication = async (query) => {
    try {
        const data = await getUserByQuery(query);
        const user = data.payload;

        user.last_connection = new Date();
        const uid = user._id || user.id;
        await updateUser(uid, user);

        const userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            fullname: user.first_name + ' ' + user.last_name,
            email: user.email,
            cart: user.cart,
            role: user.role
        };

        let token = generateToken({ userData }, '15m');
        return token;
    } catch(error) {
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const data = await getUserByEmail(email);
        if(Object.keys(data.payload).length === 0) return {status: 'error', message: 'No hay un usuario registrado en la base de datos con ese correo electrónico'};
        const user = data.payload;

        const recoveryToken = generateToken({userId: user.id}, '1h');
        user.recoveryToken = recoveryToken;
        user.recoveryTokenExpiration = Date.now() + 3600000;
        await updateUser(user.id, user);

        const resetUrl = `http://localhost:3000/resetPassword?token=${recoveryToken}`;

        const mailOptions = {
            from: nodemailerConfig.gmail_user,
            to: email,
            subject: 'coderBackend - Recuperación de contraseña',
            html: generateResetPasswordMail(user, resetUrl),
            attachments: []
        };

        const result = await transport.sendMail(mailOptions);
        return {status: 'success', message: 'El correo fue enviado a la dirección especificada', payload: result};
    } catch(error) {
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    try {
        const data = await getUserByQuery({recoveryToken: token, recoveryTokenExpiration: { $gt: Date.now() }});
        if(Object.keys(data.payload).length === 0) return {status: 'error', message: 'El token de restablecimiento de contraseña no es válido o ha caducado.'};
        const user = data.payload;

        if(isValidPassword(user, password)) return {status: 'error', message: 'Por razones de seguridad, no se puede reutilizar la misma contraseña.'};

        user.password = createHash(password);
        user.recoveryToken = '';
        user.recoveryTokenExpiration = '';
        await updateUser(user.id, user);

        return {status: 'success', message: 'La contraseña se ha modificado con éxito. Por favor ingrese a su cuenta con la nueva autenticación.'};
    } catch(error) {
        throw error;
    }
};

export const logout = async (email) => {
    try {
        const data = await getUserByEmail(email);
        const user = data.payload;
        user.last_connection = new Date();
        await updateUser(user.id, user)
    } catch(error) {
        throw error;
    }
};