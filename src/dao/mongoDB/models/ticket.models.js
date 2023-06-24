import mongoose from "mongoose";

const ticketsCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: String,
    products: Array,
    amount: Number,
    purchaser: String
});

const Ticket = mongoose.model(ticketsCollection, ticketSchema);

export default Ticket;