import * as dotenv from 'dotenv';

dotenv.config();

const nodemailerConfig = {
    gmail_service: process.env.NODEMAILER_GMAIL_SERVICE,
    gmail_port: process.env.NODEMAILER_GMAIL_PORT,
    gmail_user: process.env.NODEMAILER_GMAIL_USER,
    gmail_pass: process.env.NODEMAILER_GMAIL_PASS
}

export default nodemailerConfig;