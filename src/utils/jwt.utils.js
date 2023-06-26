import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config.js';

const jwt_secret = jwtConfig.jwt_secret;

export const generateToken = (content, expirationTime) => {
    const token = jwt.sign(content , jwt_secret, {expiresIn: expirationTime});
    return token
};