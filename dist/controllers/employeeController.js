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
exports.getAllEmployees = exports.deleteEmployee = exports.updateEmployee = exports.addEmployee = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
// Add new employee
const addEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, password, background, foreground } = req.body;
    try {
        const employee = yield businessModel_1.default.addEmployee(req.businessID, firstName, lastName, password, background, foreground);
        res.status(200).json({ employee });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addEmployee = addEmployee;
// Update employee
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeID, firstName, lastName, password, background, foreground } = req.body;
    try {
        const employee = yield businessModel_1.default.updateEmployee(req.businessID, employeeID, firstName, lastName, password, background, foreground);
        res.status(200).json({ employee });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateEmployee = updateEmployee;
// Delete employee 
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeID } = req.body;
    try {
        const employee = yield businessModel_1.default.deleteEmployee(req.businessID, employeeID);
        res.status(200).json({ employee });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteEmployee = deleteEmployee;
// get all employees
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield businessModel_1.default.getAllEmployees(req.businessID);
        res.status(200).json({ employees });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getAllEmployees = getAllEmployees;
