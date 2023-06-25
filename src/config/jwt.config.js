import * as dotenv from 'dotenv';

dotenv.config();

const jwtConfig = {
    jwt_secret: process.env.JWT_SECRET
};

export default jwtConfig;