import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: process.env.PORT
};

export default appConfig;