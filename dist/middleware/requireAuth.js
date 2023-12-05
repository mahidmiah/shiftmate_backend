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
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const businessModel_1 = __importDefault(require("../models/businessModel"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return res.status(401).json({ error: 'Request is not authorized' });
    }
    try {
        const _id = jsonwebtoken_1.default.verify(access_token, process.env.SECRET);
        const user = yield businessModel_1.default.findOne({ _id }).select('_id');
        if (!user) {
            res.status(401).json({ error: 'Request is not authorized' });
        }
        req.businessID = _id;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
});
exports.requireAuth = requireAuth;
