import { getUserByEmail, getUserByQuery, updateUser } from "../users/service.users.js";
import { isValidPassword } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";

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
            email,
            cart: user.cart,
            role: user.role
        };

        let token = generateToken(userData);
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
        await updateUser(user.id, user);

        const userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            fullname: user.first_name + ' ' + user.last_name,
            email,
            cart: user.cart,
            role: user.role
        };

        let token = generateToken(userData);
        return token;
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