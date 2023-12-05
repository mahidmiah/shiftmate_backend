import { Request, Response } from "express";
import BusinessModel from "../models/businessModel";

// Add new employee
export const addEmployee = async (req: Request, res: Response) => {
    const {firstName, lastName, password, background, foreground} = req.body;
    try {
        const employee = await BusinessModel.addEmployee(req.businessID!, firstName, lastName, password, background, foreground);
        res.status(200).json({employee});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
    const {employeeID, firstName, lastName, password, background, foreground} = req.body;
    try {
        const employee = await BusinessModel.updateEmployee(req.businessID!, employeeID, firstName, lastName, password, background, foreground);
        res.status(200).json({employee});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Delete employee 
export const deleteEmployee = async (req: Request, res: Response) => {
    const {employeeID} = req.body;
    try {
        const employee = await BusinessModel.deleteEmployee(req.businessID!, employeeID);
        res.status(200).json({employee});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await BusinessModel.getAllEmployees(req.businessID!);
        res.status(200).json({employees});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}