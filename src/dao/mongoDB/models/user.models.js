import mongoose from "mongoose";

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    cart: String,
    role: {
        type: String,
        default: 'user'
    },
    recoveryToken: {
        type: String,
        default: ''
    },
    recoveryTokenExpiration: {
        type: String,
        default: ''
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date
});

const User = mongoose.model(usersCollection, userSchema);

export default User;