import { v4 as uuidv4 } from 'uuid'
import __dirname from '../utils/dirname.utils.js';
import { ticketsDAO } from '../dao/factory.dao.js';

const tm = ticketsDAO;

export const createTicket = async (ticketInfo) => {
    try {
        const tickets = await tm.getAll();
        
        //devuelve el code con un uuid único verificado
        let code;
        let unique = false;
        while(!unique) {
            code = uuidv4();
            unique = !tickets.some(ticket => ticket.code === code);
        };

        // retorna fecha y hora de la compra en formato local (Argentina)
        const actualDate = Date();
        const options = {dateStyle: 'short', timeStyle: 'short'};
        const purchase_datetime = actualDate.toLocaleString('es-AR', options);

        const newTicketInfo = {
            code,
            purchase_datetime,
            products: ticketInfo.products,
            amount: ticketInfo.amount,
            purchaser: ticketInfo.purchaser
        };

        const data = await tm.create(newTicketInfo);
        const newTicket = {
            code: data.code,
            purchase_datetime: data.purchase_datetime,
            products: data.products,
            amount: data.amount,
            purchaser: data.purchaser
        };

        return newTicket;
    } catch(error) {    
        throw error;
    }
};