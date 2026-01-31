import {env} from "../config/env.js";

export const formatEmail = (userEmail:string, verificationUrl : string) : object => {
    return {
        from: `"Acadelym" <${env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Verify Your Account',
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome!</h2>
        <p>Thank you for registering. Please click the button below to verify your email:</p>
        <a href="${verificationUrl}" 
           style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Email Verification
        </a>
        <p>This token will expire in 1 hour.</p>
      </div>
    `,
    };
}