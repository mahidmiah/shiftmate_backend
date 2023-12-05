"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    password: String,
    background: String,
    foreground: String,
});
const EmployeeModel = mongoose_1.default.models.Employee || mongoose_1.default.model('Employee', employeeSchema);
exports.default = EmployeeModel;
