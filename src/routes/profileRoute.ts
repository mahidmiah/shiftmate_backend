import { getProfile, updateProfile } from "../controllers/profileController";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const profileRouter = Router();
profileRouter.use(requireAuth);

// Get business profile data route
profileRouter.get('/getProfile', (req, res) => {
    getProfile(req, res);
});

// Update business profile data route
profileRouter.post('/updateProfile', (req, res) => {
    updateProfile(req, res);
});

export default profileRouter;