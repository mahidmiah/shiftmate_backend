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
exports.getAllShifts = exports.updateShift = exports.deleteShift = exports.addShift = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
// Add new shift
const addShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeID, weekNumber, year, position, dayOfWeek, startTime, endTime } = req.body;
    try {
        const shift = yield businessModel_1.default.addShift(req.businessID, employeeID, weekNumber, year, position, dayOfWeek, startTime, endTime);
        res.status(200).json({ shift });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addShift = addShift;
// Delete shift
const deleteShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shiftID } = req.body;
    try {
        const shift = yield businessModel_1.default.deleteShift(req.businessID, shiftID);
        res.status(200).json({ shift });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteShift = deleteShift;
// Update shift
const updateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //if (!businessID || !shiftID || !employeeID || !position || !dayOfWeek || !startTime || !endTime || !year || !weekNumber) {
    const { shiftID, employeeID, position, dayOfWeek, startTime, endTime, year, weekNumber } = req.body;
    try {
        const shift = yield businessModel_1.default.updateShift(req.businessID, shiftID, employeeID, position, dayOfWeek, startTime, endTime, year, weekNumber);
        res.status(200).json({ shift });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateShift = updateShift;
// Get all shifts for a week
const getAllShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekNumber, year } = req.body;
    try {
        const shifts = yield businessModel_1.default.getAllShifts(req.businessID, weekNumber, year);
        res.status(200).json({ shifts });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getAllShifts = getAllShifts;
