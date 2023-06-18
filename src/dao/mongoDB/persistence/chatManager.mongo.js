import ChatMessage from "../models/chatMessage.models.js";

class ChatManager {

    getAllMessages = async () => {
        try {
            const data = await ChatMessage.find();
            return data? data : [];
        } catch(error) {
            throw error;
        }
    };

    create = async (messageInfo) => {
        try {
            const data = await ChatMessage.create(messageInfo);
            return data
        } catch(error) {
            throw error;
        }
    };

    deleteAllMessages = async () => {
        try {
            await ChatMessage.deleteMany();
            return 'Todos los mensajes fueron eliminados de la base de datos';
        } catch(error) {
            throw error;
        }
    };
};

export default ChatManager;