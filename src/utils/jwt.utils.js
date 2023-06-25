import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config.js';

const jwt_secret = jwtConfig.jwt_secret;

export const generateToken = user => {
    const token = jwt.sign({user}, jwt_secret, {expiresIn: '15m'});
    return token
};