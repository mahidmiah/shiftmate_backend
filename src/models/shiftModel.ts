import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
    businessID: String,
    year: Number,
    employeeID: String,
    position: String, // You can validate this against enum values
    dayOfWeek: String, // You can validate this against enum values
    startTime: String,
    endTime: String,
});

const ShiftModel = mongoose.models.Shift || mongoose.model('Shift', shiftSchema);

export default ShiftModel;