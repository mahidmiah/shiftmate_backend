"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const businessController_1 = require("../controllers/businessController");
const express_1 = require("express");
const positionController_1 = require("../controllers/positionController");
const requireAuth_1 = require("../middleware/requireAuth");
const businessRouter = (0, express_1.Router)();
// const issue2options = {
//     origin: true,
//     methods: ["POST"],
//     credentials: true,
//     maxAge: 3600
// };
// businessRouter.options("*", cors(issue2options));
// businessRouter.post("/issue-3", cors(issue2options), (req, res) => {
//     console.info("POST /issue-3 ...");
//     res.json({
//         text: "Issue #3 is fixed."
//     });
// });
businessRouter.post("/issue-3", (req, res) => {
    console.info("POST /issue-3 ...");
    res.json({
        text: "Issue #3 is fixed."
    });
});
// Login route
businessRouter.post('/login', (req, res) => {
    (0, businessController_1.loginUser)(req, res);
});
// Signup route
businessRouter.post('/signup', (req, res) => {
    (0, businessController_1.signupUser)(req, res);
});
//Logout route
businessRouter.post('/logout', (req, res) => {
    (0, businessController_1.logoutUser)(req, res);
});
// Verify route
businessRouter.get('/verify/:token', (req, res) => {
    (0, businessController_1.verifyUser)(req, res);
});
// Forgot password route
businessRouter.post('/forgotPassword/:email', (req, res) => {
    (0, businessController_1.forgotPassword)(req, res);
});
// Reset password route
businessRouter.get('/resetPassword/:token', (req, res) => {
    (0, businessController_1.resetPassword)(req, res);
});
// Get all positions route
businessRouter.get('/getAllPositions', requireAuth_1.requireAuth, (req, res) => {
    (0, positionController_1.getAllPositions)(req, res);
});
// Update positions route
businessRouter.post('/updatePositions', requireAuth_1.requireAuth, (req, res) => {
    (0, positionController_1.updatePositions)(req, res);
});
// Add position route
businessRouter.post('/addPosition', requireAuth_1.requireAuth, (req, res) => {
    (0, positionController_1.addPosition)(req, res);
});
// Delete position route
businessRouter.post('/deletePosition', requireAuth_1.requireAuth, (req, res) => {
    (0, positionController_1.deletePosition)(req, res);
});
exports.default = businessRouter;
