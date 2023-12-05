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
exports.getFinancials = exports.addFinancials = exports.deleteWeek = exports.addWeek = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
// Add new week
const addWeek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekNumber, year, startDate, endDate } = req.body;
    try {
        const week = yield businessModel_1.default.addWeek(req.businessID, weekNumber, year, startDate, endDate);
        res.status(200).json({ week });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addWeek = addWeek;
// Delete week
const deleteWeek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekID } = req.body;
    try {
        const week = yield businessModel_1.default.deleteWeek(req.businessID, weekID);
        res.status(200).json({ week });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteWeek = deleteWeek;
// Add financials to week
const addFinancials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, weekNumber, dayOfWeek, income, uber, expense, notes } = req.body;
    try {
        const week = yield businessModel_1.default.addFinances(req.businessID, year, weekNumber, dayOfWeek, income, uber, expense, notes);
        res.status(200).json({ week });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addFinancials = addFinancials;
// get financials for week
const getFinancials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, weekNumber } = req.body;
    try {
        const week = yield businessModel_1.default.getFinances(req.businessID, year, weekNumber);
        res.status(200).json({ week });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getFinancials = getFinancials;
