import { Request, Response } from "express";
import BusinessModel from "../models/businessModel";

// Add new week
export const addWeek = async (req: Request, res: Response) => {
    const {weekNumber, year, startDate, endDate} = req.body;
    try {
        const week = await BusinessModel.addWeek(req.businessID!, weekNumber, year, startDate, endDate);
        res.status(200).json({week});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Delete week
export const deleteWeek = async (req: Request, res: Response) => {
    const {weekID} = req.body;
    try {
        const week = await BusinessModel.deleteWeek(req.businessID!, weekID);
        res.status(200).json({week});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Add financials to week
export const addFinancials = async (req: Request, res: Response) => {
    const {year, weekNumber, dayOfWeek, income, uber, expense, notes} = req.body;
    try {
        const week = await BusinessModel.addFinances(req.businessID!, year, weekNumber, dayOfWeek, income, uber, expense, notes);
        res.status(200).json({week});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// get financials for week
export const getFinancials = async (req: Request, res: Response) => {
    const {year, weekNumber} = req.body;
    try {
        const week = await BusinessModel.getFinances(req.businessID!, year, weekNumber);
        res.status(200).json({week});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}