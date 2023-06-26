import nodemailer from 'nodemailer';
import nodemailerConfig from "../config/nodemailer.config.js";

export const transport = nodemailer.createTransport({
    service: nodemailerConfig.gmail_service,
    port: nodemailerConfig.gmail_port,
    auth: {
        user: nodemailerConfig.gmail_user,
        pass: nodemailerConfig.gmail_pass
    }
});