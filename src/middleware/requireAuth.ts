import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BusinessModel, { Business } from '../models/businessModel';
import { Model } from 'mongoose'; 

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if(!access_token) {
        return res.status(401).json({error: 'Request is not authorized'}); 
    }

    try {
        const _id = jwt.verify(access_token, process.env.SECRET!);
        const user = await BusinessModel.findOne({ _id }).select('_id');
        if(!user) {
            res.status(401).json({error: 'Request is not authorized'});
        }

        req.businessID = _id as string;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not authorized'});
    }
}