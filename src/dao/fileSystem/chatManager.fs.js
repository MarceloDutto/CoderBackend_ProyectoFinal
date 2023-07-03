import fs, { existsSync, promises, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ChatManager {
    constructor (path) {
        this.messages = [];
        this.path = path;
    };

    getAllMessages = async () => {
        try {
            if(!existsSync(this.path)) {
                this.messages = [];
                return this.messages;
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                this.messages = [];
                return this.messages;
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.messages = JSON.parse(data);
            return this.messages;      
        } catch(error) {
            throw error;
        }
    };

    create = async (messageInfo) => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.messages = JSON.parse(data);
                } else {
                    this.messages = [];
                };
            } else {
                this.messages = [];
            };
            
            let id;
            let unique = false;
            while(!unique) {
                id = uuidv4();
                unique = !this.messages.some(cart => cart.id === id);
            };

            const newMessage = {
                id,
                ...messageInfo
            };

            this.messages.push(newMessage);
            const messagesStr = JSON.stringify(this.messages, null, 2);
            writeFile(this.path, messagesStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newMessage;
        } catch(error) {
            throw error;
        }
    };

    deleteAllMessages = async () => {
        try {
            if(!existsSync(this.path)) return 'No existe el archivo';

            this.messages = [];
            const messagesStr = JSON.stringify(this.messages, null, 2);
            writeFile(this.path, messagesStr, error => {
                if(error) {
                    throw error;
                }
            }); 
            return 'Todos los carritos fueron eliminados';
        } catch(error) {
            throw error;
        }
    };
};

export default ChatManager;