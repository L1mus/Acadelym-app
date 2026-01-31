import {transporter} from "../config/nodemailer.config.js";
import {formatEmail} from "./formatEmail.js";
import {env} from "../config/env.js";

export async function sendVerificationEmail(token:string , body:string) {
    const verificationUrl = `${env.APP_URL}/verify?token=${token}`;
    try {
        const info = await transporter.sendMail(formatEmail(body,verificationUrl))
        console.log('Email sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
}
