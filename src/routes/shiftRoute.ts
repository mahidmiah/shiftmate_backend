import { addShift, deleteShift, updateShift, getAllShifts } from "../controllers/shiftController";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const shiftRouter = Router();
shiftRouter.use(requireAuth);

// Add new shift route
shiftRouter.post('/addShift', (req, res) => {
    addShift(req, res);
});

// Delete shift route
shiftRouter.post('/deleteShift', (req, res) => {
    deleteShift(req, res);
});

// Update shift route
shiftRouter.post('/updateShift', (req, res) => {
    updateShift(req, res);
});

// Get all shifts route
shiftRouter.post('/getAllShifts', (req, res) => {
    getAllShifts(req, res);
});

export default shiftRouter;