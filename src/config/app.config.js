import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: process.env.PORT || 3000,
    test_email: process.env.TEST_EMAIL
};

export default appConfig;