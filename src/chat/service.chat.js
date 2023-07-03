import __dirname from '../utils/dirname.utils.js';
import { chatDAO } from '../dao/factory.dao.js';

const chm = chatDAO;

export const getAllMessages = async () => {
    try {
        const data = await chm.getAllMessages();
        if(data.length === 0) return {status: 'error', message: 'No hay mensajes en la base de datos', payload: []};
        return {status: 'success', message: 'Se obtuvieron mensajes de la base de datos', payload: data};
    } catch(error) {
        throw error;
    }
};

export const createMessage = async (mesgInfo) => {
    try {
        const data = await chm.create(mesgInfo);
        return {message: 'Mensaje creado', payload: data}; 
    } catch(error) {
        throw error;
    }
};

export const deleteAllMessages = async () => {
    try {
        await chm.deleteAllMessages();
        return {message: 'Todos los mensajes eliminados de la base de datos'};
    } catch(error) {
        throw error;
    }
};