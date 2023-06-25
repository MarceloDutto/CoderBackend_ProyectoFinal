import * as dotenv from 'dotenv';

dotenv.config();

export const githubConfig = {
    github_client_Id: process.env.GITHUB_CLIENT_ID,
    github_client_Secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_URL: process.env.GITHUB_CALLBACK_URL
};

export const googleConfig = {
    google_client_Id: process.env.GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.GOOGLE_CALLBACK_URL
};