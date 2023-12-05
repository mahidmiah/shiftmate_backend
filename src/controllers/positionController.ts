import { Request, Response } from "express";
import BusinessModel from "../models/businessModel";

// Add new position
export const addPosition = async (req: Request, res: Response) => {
    const {name} = req.body;
    try {
        const position = await BusinessModel.addPosition(req.businessID!, name);
        res.status(200).json({position});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Update all positions
export const updatePositions = async (req: Request, res: Response) => {
    const {positions} = req.body;
    try {
        const updatedPositions = await BusinessModel.updatePositions(req.businessID!, positions);
        res.status(200).json({updatedPositions});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Delete position
export const deletePosition = async (req: Request, res: Response) => {
    const {positionID} = req.body;
    try {
        const position = await BusinessModel.deletePosition(req.businessID!, positionID);
        res.status(200).json({position});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// get all positions
export const getAllPositions = async (req: Request, res: Response) => {
    try {
        const positions = await BusinessModel.getAllPositions(req.businessID!);
        res.status(200).json({positions});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}