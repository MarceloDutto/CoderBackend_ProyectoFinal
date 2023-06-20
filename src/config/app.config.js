import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: process.env.PORT || 3000
};

export default appConfig;