import express from "express";
import { Model } from "mongoose";
import BusinessModel from "./models/businessModel";

declare module 'express' {
    interface Request {
        cookies: {
            access_token: string;
        },
        businessID?: string;
    }
}