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
exports.resetPassword = exports.forgotPassword = exports.verifyUser = exports.logoutUser = exports.signupUser = exports.loginUser = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (_id) => {
    return jsonwebtoken_1.default.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield businessModel_1.default.login(email, password);
        // create a token
        const token = createToken(user._id);
        // res.header('Access-Control-Allow-Origin', 'https://shiftmate-frontend.netlify.app');
        // res.header('Access-Control-Allow-Methods', 'POST');
        // res.header('Access-Control-Allow-Headers', 'Content-Type');
        // res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).cookie('access_token', token, {
            httpOnly: false,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true, // Ensure it's served over HTTPS
        }).json({ email, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.loginUser = loginUser;
// Signup user
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode } = req.body;
    try {
        const user = yield businessModel_1.default.signup(email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode);
        // Sign up successful - send verification email (done in the business model)
        res.status(200).json({ message: 'Successfully signed up' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.signupUser = signupUser;
// Logout user
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).cookie('access_token', '', { expires: new Date(0) }).json({ message: 'Successfully logged out!' });
});
exports.logoutUser = logoutUser;
// Verify user
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const user = yield businessModel_1.default.verify(token);
        res.status(200).json({ message: 'Successfully verified' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.verifyUser = verifyUser;
// Forgot password -> send email and update database with token
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const business = businessModel_1.default.findOne({ email });
        if (!business) {
            throw Error('No business found');
        }
        yield businessModel_1.default.forgotPassword(email);
        res.status(200).json({ message: 'Successfully sent reset password email' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.forgotPassword = forgotPassword;
// Reset password - update database with new password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const business = yield businessModel_1.default.resetPassword(token, password);
        res.status(200).json({ message: 'Successfully reset password' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
