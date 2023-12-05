"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shiftSchema = new mongoose_1.default.Schema({
    businessID: String,
    year: Number,
    employeeID: String,
    position: String,
    dayOfWeek: String,
    startTime: String,
    endTime: String,
});
const ShiftModel = mongoose_1.default.models.Shift || mongoose_1.default.model('Shift', shiftSchema);
exports.default = ShiftModel;
