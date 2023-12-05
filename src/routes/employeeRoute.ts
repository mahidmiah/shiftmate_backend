import { addEmployee, updateEmployee, deleteEmployee, getAllEmployees } from '../controllers/employeeController';
import { requireAuth } from '../middleware/requireAuth';
import { Router } from "express";

const employeeRouter = Router();
employeeRouter.use(requireAuth);

// Add new employee route
employeeRouter.post('/addEmployee', (req, res) => {
    addEmployee(req, res);
});

// Update employee route
employeeRouter.post('/updateEmployee', (req, res) => {
    updateEmployee(req, res);
});

// Delete employee route
employeeRouter.post('/deleteEmployee', (req, res) => {
    deleteEmployee(req, res);
});

// Get all employees route
employeeRouter.get('/getAllEmployees', (req, res) => {
    getAllEmployees(req, res);
});

export default employeeRouter;