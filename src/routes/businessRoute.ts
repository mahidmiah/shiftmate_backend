import { signupUser, loginUser, logoutUser, verifyUser, forgotPassword, resetPassword } from "../controllers/businessController";
import { Router } from "express";
import { addPosition, deletePosition, getAllPositions, updatePositions } from "../controllers/positionController";
import { requireAuth } from "../middleware/requireAuth";
import cors from "cors";

const businessRouter = Router();

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
    loginUser(req, res);
});

// Signup route
businessRouter.post('/signup', (req, res) => {
    signupUser(req, res);
});

//Logout route
businessRouter.post('/logout', (req, res) => {
    logoutUser(req, res);
});

// Verify route
businessRouter.get('/verify/:token', (req, res) => {
    verifyUser(req, res);
});

// Forgot password route
businessRouter.post('/forgotPassword/:email', (req, res) => {
    forgotPassword(req, res);
});

// Reset password route
businessRouter.post('/resetPassword/:token', (req, res) => {
    resetPassword(req, res);
});

// Get all positions route
businessRouter.get('/getAllPositions', requireAuth, (req, res) => {
    getAllPositions(req, res);
});

// Update positions route
businessRouter.post('/updatePositions', requireAuth, (req, res) => {
    updatePositions(req, res);
});

// Add position route
businessRouter.post('/addPosition', requireAuth, (req, res) => {
    addPosition(req, res);
});

// Delete position route
businessRouter.post('/deletePosition', requireAuth, (req, res) => {
    deletePosition(req, res);
});

export default businessRouter