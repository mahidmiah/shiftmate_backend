import { Request, Response } from 'express';
import BusinessModel from '../models/businessModel';

// Add new shift
export const addShift = async (req: Request, res: Response) => {
    const {employeeID, weekNumber, year, position, dayOfWeek, startTime, endTime} = req.body;
    try {
        const shift = await BusinessModel.addShift(req.businessID!, employeeID, weekNumber, year, position, dayOfWeek, startTime, endTime);
        res.status(200).json({shift});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Delete shift
export const deleteShift = async (req: Request, res: Response) => {
    const {shiftID} = req.body;
    try {
        const shift = await BusinessModel.deleteShift(req.businessID!, shiftID);
        res.status(200).json({shift});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Update shift
export const updateShift = async (req: Request, res: Response) => {
    //if (!businessID || !shiftID || !employeeID || !position || !dayOfWeek || !startTime || !endTime || !year || !weekNumber) {
    const {shiftID, employeeID, position, dayOfWeek, startTime, endTime, year, weekNumber} = req.body;
    try {
        const shift = await BusinessModel.updateShift(req.businessID!, shiftID, employeeID, position, dayOfWeek, startTime, endTime, year, weekNumber);
        res.status(200).json({shift});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Get all shifts for a week
export const getAllShifts = async (req: Request, res: Response) => {
    const {weekNumber, year} = req.body;
    try {
        const shifts = await BusinessModel.getAllShifts(req.businessID!, weekNumber, year);
        res.status(200).json({shifts});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}