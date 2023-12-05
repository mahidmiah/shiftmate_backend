import { Request, Response } from 'express';
import BusinessModel from '../models/businessModel';

// Get business profile data
export const getProfile = async (req: Request, res: Response) => {
    try {
        const business = await BusinessModel.getProfile(req.businessID!);
        res.status(200).json({business});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Update business profile data
export const updateProfile = async (req: Request, res: Response) => {
    const {businessName, streetLine1, streetLine2, city, postCode, ownerFirstName, ownerLastName, darkMode} = req.body;
    try {
        const business = await BusinessModel.updateProfile(req.businessID!, businessName, streetLine1, streetLine2, city, postCode, ownerFirstName, ownerLastName, darkMode);
        res.status(200).json({business});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}