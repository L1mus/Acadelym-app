const nodemailer = require("nodemailer");
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((error : any) => {
    if (error) {
        console.error("SMTP Connection Failed:", error);
    } else {
        console.log("Server ready to send emails");
    }
});