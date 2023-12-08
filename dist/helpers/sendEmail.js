"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const businessModel_1 = __importDefault(require("../models/businessModel"));
const crypto_1 = __importDefault(require("crypto"));
const base64url_1 = __importDefault(require("base64url"));
const sendEmail = ({ email, emailType, businessID }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('sendEmail function called');
    try {
        const hashedToken = crypto_1.default.createHash('sha256').update(businessID.toString()).digest();
        const base64urlHashedToken = base64url_1.default.encode(hashedToken);
        if (emailType === 'VERIFY') {
            yield businessModel_1.default.findByIdAndUpdate(businessID, {
                verifyToken: base64urlHashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        }
        else if (emailType === 'RESET') {
            yield businessModel_1.default.findByIdAndUpdate(businessID, {
                resetPasswordToken: base64urlHashedToken,
                resetPasswordTokenExpiry: Date.now() + 3600000,
            });
        }
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: "live.smtp.mailtrap.io",
                port: 587,
                auth: {
                    user: process.env.MAILER_USERNAME,
                    pass: process.env.MAILER_PASSWORD
                }
            });
            const verifyEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/api/business/verify/${base64urlHashedToken}">here</a> to verify your email</p>`;
            const resetPasswordHTML = `<p>Click <a href="${process.env.DOMAIN}/api/business/resetPassword/${base64urlHashedToken}">here</a> to reset your password</p>`;
            console.log('Username: ', process.env.MAILER_USERNAME);
            console.log('Password: ', process.env.MAILER_PASSWORD);
            const mailOptions = {
                from: 'donotreply@shiftmate.tech',
                to: email,
                subject: emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password',
                html: emailType === 'VERIFY' ? verifyEmailHTML : resetPasswordHTML,
            };
            console.log('Debug: ', mailOptions);
            const mailResponse = yield transporter.sendMail(mailOptions);
            console.log('Mail response: ', mailResponse);
            return mailResponse;
        }
        catch (error) {
            console.error('Error in sendEmail function:', error);
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.sendEmail = sendEmail;
