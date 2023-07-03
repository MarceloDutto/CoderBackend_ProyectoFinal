import fs, { existsSync, promises, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class TicketManager {
    constructor (path) {
        this.tickets = [];
        this.path = path;
    };

    getAll = async () => {
        try {
            if(!existsSync(this.path)) {
                return [];
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return [];
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.tickets = JSON.parse(data);
            return this.tickets;
        } catch(error) {
            throw error;
        }
    };

    create = async (ticketInfo) => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.tickets = JSON.parse(data);
                } else {
                    this.tickets = [];
                };
            } else {
                this.tickets = [];
            };
            
            let id;
            let unique = false;
            while(!unique) {
                id = uuidv4();
                unique = !this.tickets.some(cart => cart.id === id);
            };

            const newTicket = {
                id,
               ...ticketInfo
            };

            this.tickets.push(newTicket);
            const ticketsStr = JSON.stringify(this.tickets, null, 2);
            writeFile(this.path, ticketsStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newTicket;      
        } catch(error) {
            throw error;
        }
    };
};

export default TicketManager;