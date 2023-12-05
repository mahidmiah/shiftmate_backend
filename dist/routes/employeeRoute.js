"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employeeController_1 = require("../controllers/employeeController");
const requireAuth_1 = require("../middleware/requireAuth");
const express_1 = require("express");
const employeeRouter = (0, express_1.Router)();
employeeRouter.use(requireAuth_1.requireAuth);
// Add new employee route
employeeRouter.post('/addEmployee', (req, res) => {
    (0, employeeController_1.addEmployee)(req, res);
});
// Update employee route
employeeRouter.post('/updateEmployee', (req, res) => {
    (0, employeeController_1.updateEmployee)(req, res);
});
// Delete employee route
employeeRouter.post('/deleteEmployee', (req, res) => {
    (0, employeeController_1.deleteEmployee)(req, res);
});
// Get all employees route
employeeRouter.get('/getAllEmployees', (req, res) => {
    (0, employeeController_1.getAllEmployees)(req, res);
});
exports.default = employeeRouter;
