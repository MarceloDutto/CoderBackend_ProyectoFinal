import express from 'express';
import __dirname from './utils/dirname.utils.js';
import appConfig from './config/app.config.js';
import router from './router/index.js';
import MongoConnection from '../db/mongo.db.js';

export const app = express();
export const port = appConfig.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

MongoConnection.getInstance();

router(app);