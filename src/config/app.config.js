import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV, 
    test_email: process.env.TEST_EMAIL
};
console.log(appConfig.environment)
export default appConfig;