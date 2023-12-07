"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const businessRoute_1 = __importDefault(require("./routes/businessRoute"));
const employeeRoute_1 = __importDefault(require("./routes/employeeRoute"));
const weekRoute_1 = __importDefault(require("./routes/weekRoute"));
const shiftRoute_1 = __importDefault(require("./routes/shiftRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
dotenv_1.default.config();
// Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['https://shiftmate-frontend.netlify.app', 'https://shiftmate-backend.onrender.com', 'https://shiftmate-frontend.vercel.app', 'https://www.shiftmate.tech'],
    credentials: true
}));
app.use((req, res, next) => {
    console.log('CORS middleware - setting headers');
    res.header('Access-Control-Allow-Origin', 'https://www.shiftmate.tech');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
const issue2options = {
    origin: true,
    methods: ["POST"],
    credentials: true,
    maxAge: 3600
};
app.options("*", (0, cors_1.default)(issue2options));
// Use cookies
app.use((0, cookie_parser_1.default)());
// Allow for request body to be accessed
app.use(express_1.default.json());
app.use((req, res, next) => {
    const accessToken = req.cookies.access_token ? '\x1b[32mTrue\x1b[0m' : '\x1b[31mFalse\x1b[0m';
    console.log(`\x1b[1m\x1b[37m[${new Date().toLocaleTimeString([], { hour12: false, hourCycle: 'h23' })}] \x1b[1m\x1b[33m[Server] [Debug]\x1b[0m - Path: ${req.path} - Method: ${req.method} - Body: ${JSON.stringify(req.body)} - Access Token: ${accessToken}`);
    next(); // this has to be called
});
// route handlers
app.use('/api/business', businessRoute_1.default);
app.use('/api/employee', employeeRoute_1.default);
app.use('/api/week', weekRoute_1.default);
app.use('/api/shift', shiftRoute_1.default);
app.use('/api/profile', profileRoute_1.default);
console.log('All routes: ', app._router);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('\x1b[1m\x1b[33m[Server]\x1b[0m Connected to the database!');
    app.listen(process.env.PORT, () => {
        console.log(`\x1b[1m\x1b[33m[Server]\x1b[0m Listening on port:\x1b[1m\x1b[33m ${process.env.PORT} \x1b[0m`);
    });
})
    .catch((error) => {
    console.log(error.message);
});
