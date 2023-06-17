import * as dotenv from 'dotenv';

dotenv.config()

const dbConfig = {
    userDB: process.env.USER_DB,
    passDB: process.env.PASS_DB,
    hostDB: process.env.HOST_DB
};

export default dbConfig;