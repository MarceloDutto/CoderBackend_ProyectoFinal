import mongoose from "mongoose";

const messagesCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: Date
});

const ChatMessage = mongoose.model(messagesCollection, messageSchema);

export default ChatMessage;