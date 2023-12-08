import nodemailer from 'nodemailer';
import BusinessModel from '../models/businessModel';
import crypto from 'crypto';
import base64url from 'base64url';

export const sendEmail = async ({email, emailType, businessID}: any) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(businessID.toString()).digest();
        const base64urlHashedToken = base64url.encode(hashedToken);

        if (emailType === 'VERIFY') {
            await BusinessModel.findByIdAndUpdate(businessID, {
                verifyToken: base64urlHashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            })
        }
        else if (emailType === 'RESET') {
            await BusinessModel.findByIdAndUpdate(businessID, {
                resetPasswordToken: base64urlHashedToken,
                resetPasswordTokenExpiry: Date.now() + 3600000,
            })
        }

        const transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const verifyEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/api/business/verify/${base64urlHashedToken}">here</a> to verify your email</p>`;
        const resetPasswordHTML = `<p>Click <a href="${process.env.DOMAIN}/api/business/resetPassword/${base64urlHashedToken}">here</a> to reset your password</p>`;

        const mailOptions = {
            from: 'donotreply@shiftmate.tech',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password',
            html: emailType === 'VERIFY' ? verifyEmailHTML : resetPasswordHTML,
        }

        console.log('Debug: ', mailOptions);

        const mailResponse = await transporter.sendMail(mailOptions);

        console.log('Mail response: ', mailResponse);
        
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}