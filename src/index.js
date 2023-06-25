import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import __dirname from './utils/dirname.utils.js';
import appConfig from './config/app.config.js';
import router from './router/index.js';
import initializePassport from './config/passport.config.js';
import MongoConnection from '../db/mongo.db.js';

export const app = express();
export const port = appConfig.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

MongoConnection.getInstance();

router(app);