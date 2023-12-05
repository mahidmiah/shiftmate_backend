"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profileController_1 = require("../controllers/profileController");
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const profileRouter = (0, express_1.Router)();
profileRouter.use(requireAuth_1.requireAuth);
// Get business profile data route
profileRouter.get('/getProfile', (req, res) => {
    (0, profileController_1.getProfile)(req, res);
});
// Update business profile data route
profileRouter.post('/updateProfile', (req, res) => {
    (0, profileController_1.updateProfile)(req, res);
});
exports.default = profileRouter;
