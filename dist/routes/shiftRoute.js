"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shiftController_1 = require("../controllers/shiftController");
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const shiftRouter = (0, express_1.Router)();
shiftRouter.use(requireAuth_1.requireAuth);
// Add new shift route
shiftRouter.post('/addShift', (req, res) => {
    (0, shiftController_1.addShift)(req, res);
});
// Delete shift route
shiftRouter.post('/deleteShift', (req, res) => {
    (0, shiftController_1.deleteShift)(req, res);
});
// Update shift route
shiftRouter.post('/updateShift', (req, res) => {
    (0, shiftController_1.updateShift)(req, res);
});
// Get all shifts route
shiftRouter.post('/getAllShifts', (req, res) => {
    (0, shiftController_1.getAllShifts)(req, res);
});
exports.default = shiftRouter;
