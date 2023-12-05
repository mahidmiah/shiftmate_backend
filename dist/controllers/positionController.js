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
exports.getAllPositions = exports.deletePosition = exports.updatePositions = exports.addPosition = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
// Add new position
const addPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const position = yield businessModel_1.default.addPosition(req.businessID, name);
        res.status(200).json({ position });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addPosition = addPosition;
// Update all positions
const updatePositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { positions } = req.body;
    try {
        const updatedPositions = yield businessModel_1.default.updatePositions(req.businessID, positions);
        res.status(200).json({ updatedPositions });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updatePositions = updatePositions;
// Delete position
const deletePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { positionID } = req.body;
    try {
        const position = yield businessModel_1.default.deletePosition(req.businessID, positionID);
        res.status(200).json({ position });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deletePosition = deletePosition;
// get all positions
const getAllPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield businessModel_1.default.getAllPositions(req.businessID);
        res.status(200).json({ positions });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getAllPositions = getAllPositions;
