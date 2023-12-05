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
exports.updateProfile = exports.getProfile = void 0;
const businessModel_1 = __importDefault(require("../models/businessModel"));
// Get business profile data
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = yield businessModel_1.default.getProfile(req.businessID);
        res.status(200).json({ business });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getProfile = getProfile;
// Update business profile data
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, streetLine1, streetLine2, city, postCode, ownerFirstName, ownerLastName, darkMode } = req.body;
    try {
        const business = yield businessModel_1.default.updateProfile(req.businessID, businessName, streetLine1, streetLine2, city, postCode, ownerFirstName, ownerLastName, darkMode);
        res.status(200).json({ business });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateProfile = updateProfile;
