import mongoose from "mongoose";
import dbConfig from "../src/config/db.config.js";

const { userDB, passDB, hostDB } = dbConfig;
const url = `mongodb+srv://${userDB}:${passDB}@${hostDB}/?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

class MongoConnection {
    static #instance;

    static getInstance() {
        if(this.#instance) {
            console.log('db is already connected');
            return this.#instance;
        }

        mongoose.connect(url, options)
            .then((connection) => {
                this.#instance = connection;
                console.log('db succesfully connected');
                return this.#instance;
            })
            .catch(error => {console.log('Failed to connect to db', error)});
    }
};

export default MongoConnection;