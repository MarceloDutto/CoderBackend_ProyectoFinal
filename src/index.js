import express from 'express';
import appConfig from './config/app.config.js';
import MongoConnection from '../db/mongo.db.js';

export const app = express();
export const port = appConfig.port;

MongoConnection.getInstance();