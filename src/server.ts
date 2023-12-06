import Express from "express";
import dotenv  from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import businessRouter from "./routes/businessRoute";
import employeeRouter from "./routes/employeeRoute";
import weekRouter from "./routes/weekRoute";
import shiftRouter from "./routes/shiftRoute";
import profileRouter from "./routes/profileRoute";

dotenv.config();
// Express app
const app = Express();

app.use(cors({
    origin: ['https://shiftmate-frontend.netlify.app', 'https://shiftmate-backend.onrender.com', 'https://shiftmate-frontend.vercel.app'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log('CORS middleware - setting headers');
    res.header('Access-Control-Allow-Origin', 'https://shiftmate-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})

const issue2options = {
    origin: true,
    methods: ["POST"],
    credentials: true,
    maxAge: 3600
};
app.options("*", cors(issue2options));

// Use cookies
app.use(cookieParser());

// Allow for request body to be accessed
app.use(Express.json());

app.use((req, res, next) => {
    const accessToken = req.cookies.access_token ? '\x1b[32mTrue\x1b[0m' : '\x1b[31mFalse\x1b[0m';
    console.log(`\x1b[1m\x1b[37m[${new Date().toLocaleTimeString([], {hour12: false, hourCycle: 'h23'})}] \x1b[1m\x1b[33m[Server] [Debug]\x1b[0m - Path: ${req.path} - Method: ${req.method} - Body: ${JSON.stringify(req.body)} - Access Token: ${accessToken}`);
    next(); // this has to be called
});

// route handlers
app.use('/api/business', businessRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/week', weekRouter);
app.use('/api/shift', shiftRouter);
app.use('/api/profile', profileRouter);

console.log('All routes: ', app._router);

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('\x1b[1m\x1b[33m[Server]\x1b[0m Connected to the database!');
        app.listen(process.env.PORT, () => {
            console.log(`\x1b[1m\x1b[33m[Server]\x1b[0m Listening on port:\x1b[1m\x1b[33m ${process.env.PORT} \x1b[0m`);
        })
    })
    .catch((error: Error) => {
        console.log(error.message);
    });