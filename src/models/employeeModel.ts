import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    background: String,
    foreground: String,
});

const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default EmployeeModel;