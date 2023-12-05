"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weekController_1 = require("../controllers/weekController");
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const weekRouter = (0, express_1.Router)();
weekRouter.use(requireAuth_1.requireAuth);
// Add new week route
weekRouter.post('/addWeek', (req, res) => {
    (0, weekController_1.addWeek)(req, res);
});
// Delete week route
weekRouter.post('/deleteWeek', (req, res) => {
    (0, weekController_1.deleteWeek)(req, res);
});
// Get week route
// weekRouter.post('/getWeek', (req, res) => {
//     getWeek(req, res);
// });
// Get financials route
weekRouter.post('/getFinancials', (req, res) => {
    (0, weekController_1.getFinancials)(req, res);
});
// Add financials route
weekRouter.post('/addFinancials', (req, res) => {
    (0, weekController_1.addFinancials)(req, res);
});
exports.default = weekRouter;
