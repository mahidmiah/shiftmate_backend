import { Request, Response } from "express";
import BusinessModel from "../models/businessModel";
import jwt from 'jsonwebtoken';

const createToken = (_id: string) => {
    return jwt.sign({_id}, process.env.SECRET!, { expiresIn: '3d' });
}

// Login user
export const loginUser = async (req: Request, res:Response) => {
    const {email, password} = req.body;
    try {
        const user = await BusinessModel.login(email, password);

        // create a token
        const token = createToken(user._id);

        // res.header('Access-Control-Allow-Origin', 'https://shiftmate-frontend.netlify.app');
        // res.header('Access-Control-Allow-Methods', 'POST');
        // res.header('Access-Control-Allow-Headers', 'Content-Type');
        // res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).cookie('access_token', token, {
            httpOnly: false,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days (in milliseconds)
            sameSite: 'none', 
            // secure: true, // Ensure it's served over HTTPS
        }).json({email, token});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Signup user
export const signupUser = async (req: Request, res: Response) => {
    const {
        email, 
        password, 
        ownerFirstName, 
        ownerLastName, 
        businessName, 
        businessType, 
        streetLine1, 
        streetLine2, 
        city, 
        postCode
    } = req.body;
    try {
        const user = await BusinessModel.signup(
            email, 
            password, 
            ownerFirstName, 
            ownerLastName, 
            businessName, 
            businessType, 
            streetLine1, 
            streetLine2, 
            city, 
            postCode
        );
        // Sign up successful - send verification email (done in the business model)
        res.status(200).json({message: 'Successfully signed up'});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
    res.status(200).cookie('access_token', '', { expires: new Date(0) }).json({message: 'Successfully logged out!'});
}

// Verify user
export const verifyUser = async (req: Request, res: Response) => {
    const {token} = req.params;
    try {
        const user = await BusinessModel.verify(token);
        res.status(200).json({message: 'Successfully verified'});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Forgot password -> send email and update database with token
export const forgotPassword = async (req: Request, res: Response) => {
    const {email} = req.params;
    try {
        const business = BusinessModel.findOne({email});
        if (!business) {
            throw Error('No business found');
        }
        await BusinessModel.forgotPassword(email);
        res.status(200).json({message: 'Successfully sent reset password email'});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Reset password - update database with new password
export const resetPassword = async (req: Request, res: Response) => {
    const {token} = req.params;
    const {password} = req.body;
    try {
        const business = await BusinessModel.resetPassword(token, password);
        res.status(200).json({message: 'Successfully reset password'});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}