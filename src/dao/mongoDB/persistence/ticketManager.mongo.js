import Ticket from "../models/ticket.models.js";

class TicketManager {

    getAll = async () => {
        try {
            const data = await Ticket.find();
            return data? data : [];
        } catch(error) {
            throw error;
        }
    };

    getById = async (tid) => {
        try {
            const data = await Ticket.findById(tid);
            return data? data: {};
        } catch(error) {
            throw error;
        }
    };

    create = async (ticketInfo) => {
        try {
            const data = await Ticket.create(ticketInfo);
            return data;
        } catch(error) {
            throw error;
        }
    };

    delete = async (tid) => {
        try {
            const data = await Ticket.findByIdAndDelete(tid);
            return data;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await Ticket.deleteMany();
            return 'Todos los tickets fueron eliminados de la base de datos';
        } catch(error) {
            throw error;
        }
    };
};

export default TicketManager;