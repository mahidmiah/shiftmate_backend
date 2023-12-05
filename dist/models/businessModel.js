"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const employeeModel_1 = __importDefault(require("./employeeModel"));
const weekModel_1 = __importDefault(require("./weekModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const sendEmail_1 = require("../helpers/sendEmail");
const shiftModel_1 = __importDefault(require("./shiftModel"));
const businessSchema = new mongoose_1.Schema({
    businessName: { type: String, required: true },
    businessAddress: {
        streetLine1: { type: String, required: true },
        streetLine2: { type: String },
        city: { type: String, required: true },
        postCode: { type: String, required: true },
    },
    businessType: { type: String, required: true },
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    darkMode: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    employees: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' }],
    positions: { type: [String], default: null },
    weeks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Week' }],
    verifyToken: String,
    verifyTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    shifts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Shift' }],
});
// Static signup method
businessSchema.statics.signup = function (email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password || !ownerFirstName || !ownerLastName || !businessName || !businessType || !streetLine1 || !city || !postCode) {
            throw Error('All fields must be filled.');
        }
        if (!validator_1.default.isEmail(email)) {
            throw Error('Email is not valid');
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const exists = yield this.findOne({ email });
        if (exists) {
            throw Error('Email already in use.');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const business = yield this.create({
            email: email,
            password: hash,
            businessName: businessName,
            businessType: businessType,
            businessAddress: {
                streetLine1: streetLine1,
                streetLine2: streetLine2 || '-',
                city: city,
                postCode: postCode
            },
            ownerFirstName: ownerFirstName,
            ownerLastName: ownerLastName,
        });
        yield (0, sendEmail_1.sendEmail)({ email, emailType: 'VERIFY', businessID: business._id });
        return business;
    });
};
// Static login method
businessSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password) {
            throw Error('All fields must be filled');
        }
        const user = yield this.findOne({ email });
        if (!user) {
            throw Error('Incorrect email');
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw Error('Icorrect password');
        }
        if (user.verified === false) {
            throw Error('Please verify your email');
        }
        return user;
    });
};
// Static verify method
businessSchema.statics.verify = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            throw Error('No ID provided');
        }
        const business = yield this.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });
        if (!business) {
            throw Error('No business found');
        }
        if (business.verified === true) {
            throw Error('Business already verified');
        }
        business.verified = true;
        yield business.save();
        return business;
    });
};
// Static forgot password method
businessSchema.statics.forgotPassword = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email) {
            throw Error('No email provided');
        }
        const business = yield this.findOne({ email });
        if (!business) {
            throw Error('No business found');
        }
        // send email -> and also set the reset token and expiry
        yield (0, sendEmail_1.sendEmail)({ email, emailType: 'RESET', businessID: business._id });
        return business;
    });
};
// Reset password method
businessSchema.statics.resetPassword = function (token, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token || !password) {
            throw Error('No token or password provided');
        }
        const business = yield this.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: Date.now() }
        });
        if (!business) {
            throw Error('No business found');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        business.password = hash;
        business.resetPasswordToken = undefined;
        business.resetPasswordTokenExpiry = undefined;
        yield business.save();
        return business;
    });
};
// Add employee method
businessSchema.statics.addEmployee = function (businessID, firstName, lastName, password, background, foreground) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !firstName || !lastName || !password || !background || !foreground) {
            throw Error('All fields must be filled');
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const employee = yield employeeModel_1.default.create({
            firstName: firstName,
            lastName: lastName,
            password: hash,
            foreground: foreground,
            background: background,
        });
        business.employees.push(employee._id);
        business.save();
        return employee;
    });
};
// Update employee method 
businessSchema.statics.updateEmployee = function (businessID, employeeID, firstName, lastName, password, background, foreground) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !employeeID || !firstName || !lastName || !password || !background || !foreground) {
            throw Error('All fields must be filled');
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const employee = yield employeeModel_1.default.findOneAndUpdate({ _id: employeeID }, {
            firstName: firstName,
            lastName: lastName,
            password: hash,
            foreground: foreground,
            background: background,
        });
        if (!employee) {
            throw Error('No employee found');
        }
        return employee;
    });
};
// Delete employee method
businessSchema.statics.deleteEmployee = function (businessID, employeeID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !employeeID) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const employee = yield employeeModel_1.default.findByIdAndDelete(employeeID);
        if (!employee) {
            throw Error('No employee found');
        }
        const shifts = yield shiftModel_1.default.find({ _id: { $in: business.shifts }, employeeID: employeeID }).select('_id');
        // Delete all shifts with the position
        if (shifts.length >= 1) {
            yield shiftModel_1.default.deleteMany({ _id: { $in: shifts } });
        }
        const shiftsWithEmployeeIds = shifts.map(shift => shift._id.toString());
        // Pull the shifts from the business and weeks
        yield business.shifts.pull(...shifts);
        yield Promise.all(business.weeks.map((weekID) => __awaiter(this, void 0, void 0, function* () {
            const week = yield weekModel_1.default.findOne({ _id: weekID });
            week.shifts = week.shifts.filter((shift) => !shiftsWithEmployeeIds.includes(shift.toString()));
            yield week.save();
        })));
        business.employees = business.employees.filter((employee) => employee._id !== employeeID);
        business.save();
        return employee;
    });
};
// Get all employees method
businessSchema.statics.getAllEmployees = function (businessID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID) {
            throw Error('No business ID provided');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const employees = yield employeeModel_1.default.find({ _id: { $in: business.employees } });
        // const employeesWithoutHashedPassword = employees.map((employee: any) => {
        //     return {
        //         _id: employee._id,
        //         firstName: employee.firstName,
        //         lastName: employee.lastName,
        //         foreground: employee.foreground,
        //         background: employee.background,
        //         password: employee.password,
        //     }
        // });
        if (!employees) {
            throw Error('No employees found');
        }
        return employees;
    });
};
// Add new week method
businessSchema.statics.addWeek = function (businessID, weekNumber, year, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !weekNumber || !year || !startDate || !endDate) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const existingWeek = yield weekModel_1.default.findOne({ weekNumber: weekNumber, year: year });
        if (existingWeek) {
            throw Error('Week already exists');
        }
        const previousWeekID = (business.weeks.length >= 1) ? business.weeks[business.weeks.length - 1].toString() : null;
        // Check if the previous week exists, if not, create a new week
        if (!previousWeekID) {
            const week = yield weekModel_1.default.create({
                businessID: businessID,
                weekNumber: weekNumber,
                year: year,
                weekStartDate: startDate,
                weekEndDate: endDate,
            });
            business.weeks.push(week._id);
            business.save();
            return week;
        }
        // Fetch the previous week
        const previousWeek = yield weekModel_1.default.findById(previousWeekID);
        // Copy the shifts from the previous week
        const newShifts = yield Promise.all(previousWeek.shifts.map((shiftID) => __awaiter(this, void 0, void 0, function* () {
            const foundShift = yield shiftModel_1.default.findById(shiftID);
            const newShift = yield shiftModel_1.default.create({
                businessID: foundShift.businessID,
                employeeID: foundShift.employeeID,
                year: foundShift.year,
                position: foundShift.position,
                dayOfWeek: foundShift.dayOfWeek,
                startTime: foundShift.startTime,
                endTime: foundShift.endTime,
            });
            return newShift._id;
        })));
        // Create the new week
        const newWeek = yield weekModel_1.default.create({
            weekNumber: weekNumber,
            year: year,
            startDate: startDate,
            endDate: endDate,
            shifts: newShifts,
        });
        business.weeks.push(newWeek._id);
        // Add the new shifts to the business
        business.shifts.push(...newShifts);
        // Save the business and the week
        newWeek.save();
        // Save the business
        business.save();
        return newWeek;
    });
};
// Delete week method
businessSchema.statics.deleteWeek = function (businessID, weekID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !weekID) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const week = yield weekModel_1.default.findByIdAndDelete(weekID);
        if (!week) {
            throw Error('No week found');
        }
        const shifts = yield shiftModel_1.default.find({ _id: { $in: week.shifts } }).select('_id');
        yield shiftModel_1.default.deleteMany({ _id: { $in: shifts } });
        yield business.shifts.pull(shifts);
        weekModel_1.default.findByIdAndDelete(weekID);
        business.weeks = business.weeks.filter((week) => week._id !== weekID);
        business.save();
        return week;
    });
};
// Add new position method
businessSchema.statics.addPosition = function (businessID, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !name) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        if (business.positions.includes(name)) {
            throw Error('Position already exists');
        }
        business.positions.push(name);
        business.save();
        return business;
    });
};
// Update all positions method
businessSchema.statics.updatePositions = function (businessID, positions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !positions) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        business.positions = positions;
        business.save();
        return business;
    });
};
// Delete position method
businessSchema.statics.deletePosition = function (businessID, positionID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !positionID) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        if (!business.positions.includes(positionID)) {
            throw Error('Position does not exist');
        }
        // Delete all shifts with the position
        const shiftsWithPosition = yield shiftModel_1.default.find({ _id: { $in: business.shifts }, position: positionID }).select('_id');
        if (shiftsWithPosition.length >= 1) {
            yield shiftModel_1.default.deleteMany({ _id: { $in: shiftsWithPosition } });
        }
        const shiftsWithPositionIds = shiftsWithPosition.map(shift => shift._id.toString());
        // Pull the shifts from the business and weeks
        yield business.shifts.pull(...shiftsWithPosition);
        yield Promise.all(business.weeks.map((weekID) => __awaiter(this, void 0, void 0, function* () {
            const week = yield weekModel_1.default.findOne({ _id: weekID });
            week.shifts = week.shifts.filter((shift) => !shiftsWithPositionIds.includes(shift.toString()));
            yield week.save();
        })));
        // Pull the position from the business
        const positionIndex = business.positions.findIndex((position, index) => position === positionID);
        if (positionIndex !== -1) {
            business.positions.splice(positionIndex, 1);
        }
        business.save();
        return business;
    });
};
// Get all positions method
businessSchema.statics.getAllPositions = function (businessID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID) {
            throw Error('No business ID provided');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        return business.positions;
    });
};
// Add new shift method
businessSchema.statics.addShift = function (businessID, employeeID, weekNumber, year, position, dayOfWeek, startTime, endTime) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !employeeID || !year || !position || !dayOfWeek || !startTime || !endTime || !weekNumber) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const employee = yield employeeModel_1.default.findOne({ _id: employeeID });
        if (!employee) {
            throw Error('No employee found');
        }
        const week = yield weekModel_1.default.findOne({ businessID: businessID, year: year, weekNumber: weekNumber });
        if (!week) {
            throw Error('No week found');
        }
        // Check if the shift overlaps with another shift, must be of the same position, so a shift of the same position, on the same day, cannot overlap
        const getDecimalHours = (time) => {
            const [hours, minutes] = time.split(':');
            const minuteDecimal = parseInt(minutes) / 60;
            return parseInt(hours) + minuteDecimal;
        };
        let overlappingShift = false;
        console.log(dayOfWeek);
        for (const shiftID of week.shifts) {
            const foundShift = yield shiftModel_1.default.findById(shiftID);
            // console.log('[Debug]:', foundShift)
            if (foundShift !== null && foundShift.dayOfWeek === dayOfWeek && foundShift.position === position) {
                const startTimeDecimal = getDecimalHours(startTime);
                const endTimeDecimal = getDecimalHours(endTime);
                const foundShiftStartTimeDecimal = getDecimalHours(foundShift.startTime);
                const foundShiftEndTimeDecimal = getDecimalHours(foundShift.endTime);
                if ((startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal > foundShiftStartTimeDecimal &&
                    endTimeDecimal <= foundShiftEndTimeDecimal) ||
                    (startTimeDecimal > foundShiftStartTimeDecimal &&
                        startTimeDecimal < foundShiftEndTimeDecimal &&
                        endTimeDecimal >= foundShiftEndTimeDecimal) ||
                    (startTimeDecimal <= foundShiftStartTimeDecimal &&
                        endTimeDecimal >= foundShiftEndTimeDecimal)) {
                    overlappingShift = true;
                    break;
                }
            }
        }
        // console.log('B')
        if (overlappingShift) {
            throw Error('Shift overlaps with another shift');
        }
        console.log('A');
        const shift = yield shiftModel_1.default.create({ businessID: businessID, year: year, employeeID: employeeID, position: position, dayOfWeek: dayOfWeek, startTime: startTime, endTime: endTime });
        week.shifts.push(shift);
        business.shifts.push(shift);
        console.log('B');
        business.save();
        week.save();
        return shift;
    });
};
businessSchema.statics.deleteShift = function (businessID, shiftID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !shiftID) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const shift = yield shiftModel_1.default.findByIdAndDelete(shiftID);
        if (!shift) {
            throw Error('No shift found');
        }
        const week = yield weekModel_1.default.findOne({ shifts: shiftID });
        if (!week) {
            throw Error('No week found');
        }
        business.shifts = business.shifts.filter((id) => id.toString() !== shiftID);
        week.shifts = week.shifts.filter((id) => id.toString() !== shiftID);
        yield week.save();
        yield business.save();
        return shift;
    });
};
// Update shift method
businessSchema.statics.updateShift = function (businessID, shiftID, employeeID, position, dayOfWeek, startTime, endTime, year, weekNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !shiftID || !employeeID || !position || !dayOfWeek || !startTime || !endTime || !year || !weekNumber) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const employee = yield employeeModel_1.default.findOne({ _id: employeeID });
        if (!employee) {
            throw Error('No employee found');
        }
        const week = yield weekModel_1.default.findOne({ businessID: businessID, year: year, weekNumber: weekNumber });
        if (!week) {
            throw Error('No week found');
        }
        // Check if the shift overlaps with another shift, must be of the same position, so a shift of the same position, on the same day, cannot overlap
        const getDecimalHours = (time) => {
            const [hours, minutes] = time.split(':');
            const minuteDecimal = parseInt(minutes) / 60;
            return parseInt(hours) + minuteDecimal;
        };
        let overlappingShift = false;
        for (const shiftIDInWeek of week.shifts) {
            const foundShift = yield shiftModel_1.default.findById(shiftIDInWeek);
            if (foundShift !== null && foundShift.dayOfWeek === dayOfWeek && foundShift.position === position && foundShift._id.toString() !== shiftID) {
                const startTimeDecimal = getDecimalHours(startTime);
                const endTimeDecimal = getDecimalHours(endTime);
                const foundShiftStartTimeDecimal = getDecimalHours(foundShift.startTime);
                const foundShiftEndTimeDecimal = getDecimalHours(foundShift.endTime);
                if ((startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal > foundShiftStartTimeDecimal &&
                    endTimeDecimal <= foundShiftEndTimeDecimal) ||
                    (startTimeDecimal > foundShiftStartTimeDecimal &&
                        startTimeDecimal < foundShiftEndTimeDecimal &&
                        endTimeDecimal >= foundShiftEndTimeDecimal) ||
                    (startTimeDecimal <= foundShiftStartTimeDecimal &&
                        endTimeDecimal >= foundShiftEndTimeDecimal)) {
                    overlappingShift = true;
                    break;
                }
            }
        }
        if (overlappingShift) {
            throw Error('Shift overlaps with another shift');
        }
        const shift = yield shiftModel_1.default.findOneAndUpdate({ _id: shiftID }, { employeeID: employeeID, position: position, dayOfWeek: dayOfWeek, startTime: startTime, endTime: endTime });
        if (!shift) {
            throw Error('No shift found');
        }
        return shift;
    });
};
// Get all shifts for a week method
businessSchema.statics.getAllShifts = function (businessID, weekNumber, year) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !weekNumber || !year) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        const week = yield weekModel_1.default.findOne({ weekNumber: weekNumber, year: year });
        if (!week) {
            throw Error('No week found');
        }
        const shifts = yield shiftModel_1.default.find({ _id: { $in: week.shifts } });
        if (!shifts) {
            throw Error('No shifts found');
        }
        return shifts;
    });
};
// Get business profile data method
businessSchema.statics.getProfile = function (businessID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID) {
            throw Error('No business ID provided');
        }
        const business = yield this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -weeks -employees');
        if (!business) {
            throw Error('No business found');
        }
        return business;
    });
};
// Update business profile data method
businessSchema.statics.updateProfile = function (businessID, businessName, streetLine1, streetLine2, city, postCode, ownerFirstName, ownerLastName, darkMode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || !businessName || !streetLine1 || !city || !postCode || !ownerFirstName || !ownerLastName) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID });
        if (!business) {
            throw Error('No business found');
        }
        business.businessName = businessName;
        business.businessAddress.streetLine1 = streetLine1;
        business.businessAddress.streetLine2 = streetLine2;
        business.businessAddress.city = city;
        business.businessAddress.postCode = postCode;
        business.ownerFirstName = ownerFirstName;
        business.ownerLastName = ownerLastName;
        business.darkMode = darkMode;
        business.save();
        return business;
    });
};
// Add finances method
businessSchema.statics.addFinances = function (businessID, year, weekNumber, dayOfWeek, income, uber, expense, notes) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('A');
        if (!businessID || !year || !weekNumber || !dayOfWeek || !income || !uber || !expense || !notes) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -shifts -weeks -employees');
        if (!business) {
            throw Error('No business found');
        }
        const week = yield weekModel_1.default.findOne({ year: year, weekNumber: weekNumber });
        console.log('B');
        if (!week) {
            throw Error('No week found');
        }
        if (!week.finances) {
            week.finances = {};
        }
        const dayOfWeek_ = dayOfWeek[0].toUpperCase() + dayOfWeek.slice(1);
        if (!week.finances[dayOfWeek_]) {
            week.finances[dayOfWeek_] = {};
        }
        console.log('C');
        week.finances[dayOfWeek_].income = income;
        week.finances[dayOfWeek_].uber = uber;
        week.finances[dayOfWeek_].expense = expense;
        week.finances[dayOfWeek_].notes = notes;
        console.log(week.finances[dayOfWeek_]);
        yield week.save();
        return week.finances;
    });
};
// Get finances method
businessSchema.statics.getFinances = function (businessID, year, weekNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!businessID || year === undefined || weekNumber === undefined) {
            throw Error('All fields must be filled');
        }
        const business = yield this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -shifts -weeks -employees');
        if (!business) {
            throw Error('No business found');
        }
        const week = yield weekModel_1.default.findOne({ year: year, weekNumber: weekNumber });
        if (!week) {
            throw Error('No week found');
        }
        return week.finances;
    });
};
const BusinessModel = (0, mongoose_1.model)('Business', businessSchema);
exports.default = BusinessModel;
