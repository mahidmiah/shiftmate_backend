import { addFinancials, addWeek, deleteWeek, getFinancials } from "../controllers/weekController";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const weekRouter = Router();
weekRouter.use(requireAuth);

// Add new week route
weekRouter.post('/addWeek', (req, res) => {
    addWeek(req, res);
});

// Delete week route
weekRouter.post('/deleteWeek', (req, res) => {
    deleteWeek(req, res);
});

// Get week route
// weekRouter.post('/getWeek', (req, res) => {
//     getWeek(req, res);
// });

// Get financials route
weekRouter.post('/getFinancials', (req, res) => {
    getFinancials(req, res);
});

// Add financials route
weekRouter.post('/addFinancials', (req, res) => {
    addFinancials(req, res);
});

export default weekRouter;