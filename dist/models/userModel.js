"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const businessSchema = new mongoose_1.Schema({
    businessName: { type: String, required: true },
    businessAddress: {
        streetLine1: { String, required: true },
        streetLine2: { type: String },
        city: { type: String, required: true },
        postCode: { type: String, required: true },
    },
    businessType: { type: String, required: true },
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    darkMode: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    employees: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' }],
    positions: { type: [String], default: null },
    weeks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Week' }],
    verifyToken: String,
    verifyTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// Static signup method
businessSchema.statics.signup = function (email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password || !ownerFirstName || !ownerLastName || !businessName || !businessType || !streetLine1 || !city || !postCode) {
            throw Error('All fields must be filled.');
        }
        if (!validator_1.default.isEmail(email)) {
            throw Error('Email is not valid');
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const exists = yield this.findOne({ email });
        if (exists) {
            throw Error('Email already in use.');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const business = yield this.create({
            email: email,
            password: hash,
            businessName: businessName,
            businessType: businessType,
            businessAddress: {
                streetLine1: streetLine1,
                streetLine2: streetLine2 || '-',
                city: city,
                postCode: postCode
            },
            ownerFirstName: ownerFirstName,
            ownerLastName: ownerLastName,
        });
        return business;
    });
};
