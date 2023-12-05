import mongoose, { Model, Schema, model } from 'mongoose';
import EmployeeModel from './employeeModel';
import WeekModel from './weekModel';
import bcrypt from 'bcrypt';
import validator from "validator";
import { sendEmail } from '../helpers/sendEmail';
import ShiftModel from './shiftModel';

export interface Business extends Document {
    businessName: string;
    businessAddress: {
        streetLine1: string;
        streetLine2: string;
        city: string;
        postCode: string;
    };
    ownerFirstName: string;
    ownerLastName: string;
    businessType: string;
    darkMode: boolean;
    verified: boolean;
    employees: [];
    positions: [];
    weeks: [];
    verifyToken: String;
    verifyTokenExpiry: Date;
    resetPasswordToken: String;
    resetPasswordTokenExpiry: Date;
    _id: string;
    email: string;
    password: string;
    shifts: [];
}

interface BusinessModel extends Model<Business> {
    login(email: string, password: string): Promise<Business>;
    signup(email: string, password: string, ownerFirstName: string, ownerLastName: string, businessName: string, businessType: string, streetLine1: string, streetLine2: string, city: string, postCode: string): Promise<Business>;
    verify(id: string): Promise<Business>;
    forgotPassword(email: string): Promise<Business>;
    resetPassword(token: string, password: string): Promise<Business>;
    addEmployee(businessID: string, firstName: string, lastName: string, password: string, background: string, foreground: string): Promise<Business>;
    updateEmployee(businessID: string, employeeID: string, firstName: string, lastName: string, password: string, background: string, foreground: string): Promise<Business>;
    deleteEmployee(businessID: string, employeeID: string): Promise<Business>;
    getAllEmployees(businessID: string): Promise<Business>;
    addWeek(businessID: string, weekNumber: number, year: number, startDate: Date, endDate: Date): Promise<Business>;
    deleteWeek(businessID: string, weekID: string): Promise<Business>;
    addPosition(businessID: string, name: string): Promise<Business>;
    updatePositions(businessID: string, positions: []): Promise<Business>;
    deletePosition(businessID: string, positionID: string): Promise<Business>;
    addShift(businessID: string, employeeID: string, weekNumber: number, year: number, position: string, dayOfWeek: number, startTime: string, endTime: string): Promise<Business>;
    deleteShift(businessID: string, shiftID: string): Promise<Business>;
    updateShift(businessID: string, shiftID: string, employeeID: string, position: string, dayOfWeek: number, startTime: string, endTime: string, year: number, weekNumber: number): Promise<Business>;
    getAllShifts(businessID: string, weekNumber: number, year: number): Promise<Business>;
    getProfile(businessID: string): Promise<Business>;
    updateProfile(businessID: string, businessName: string, streetLine1: string, streetLine2: string, city: string, postCode: string, ownerFirstName: string, ownerLastName: string, darkMode: boolean): Promise<Business>;
    getAllPositions(businessID: string): Promise<Business>;
    addFinances(businessID: string, year: number, weekNumber: number, dayOfWeek: string, income: number, uber: number, expense: number, notes: string): Promise<Business>;
    getFinances(businessID: string, year: number, weekNumber: number): Promise<Business>;
}

const businessSchema = new Schema<Business>({
    businessName: {type: String, required: true},
    businessAddress: {
        streetLine1: {type: String, required: true},
        streetLine2: {type: String},
        city: {type: String, required: true},
        postCode: {type: String, required: true},
    },
    businessType: {type: String, required: true},
    ownerFirstName: {type: String, required: true},
    ownerLastName: {type: String, required: true},
    darkMode: {type: Boolean, default: true},
    verified: {type: Boolean, default: false},
    employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}],
    positions: {type: [String], default: null},
    weeks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Week'}],
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
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
});


// Static signup method
businessSchema.statics.signup = async function(email: string, password: string, ownerFirstName: string, ownerLastName: string, businessName: string, businessType: string, streetLine1: string, streetLine2: string, city: string, postCode: string) {

    if (!email || !password || !ownerFirstName || !ownerLastName || !businessName || !businessType || !streetLine1 || !city || !postCode) {
        throw Error('All fields must be filled.');
    }

    if(!validator.isEmail(email)){
        throw Error('Email is not valid');
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough');
    }

    const exists = await this.findOne({ email });

    if(exists) {
        throw Error('Email already in use.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const business = await this.create({
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

    await sendEmail({email, emailType: 'VERIFY', businessID: business._id});

    return business;
};


// Static login method
businessSchema.statics.login = async function(email: string, password: string) {
    if (!email || !password){
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Icorrect password');
    }

    if (user.verified === false) {
        throw Error('Please verify your email');
    }

    return user;
}

// Static verify method
businessSchema.statics.verify = async function(token: string) {
    if (!token) {
        throw Error('No ID provided');
    }

    const business = await this.findOne({
        verifyToken: token,
        verifyTokenExpiry: {$gt: Date.now()}
    });

    if (!business) {
        throw Error('No business found');
    }

    if (business.verified === true) {
        throw Error('Business already verified');
    }

    business.verified = true;
    await business.save();

    return business;

}

// Static forgot password method
businessSchema.statics.forgotPassword = async function(email: string) {
    if (!email) {
        throw Error('No email provided');
    }

    const business = await this.findOne({email});

    if (!business) {
        throw Error('No business found');
    }

    // send email -> and also set the reset token and expiry
    await sendEmail({email, emailType: 'RESET', businessID: business._id});
    
    return business;
}

// Reset password method
businessSchema.statics.resetPassword = async function(token: string, password: string) {
    if (!token || !password) {
        throw Error('No token or password provided');
    }

    const business = await this.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiry: {$gt: Date.now()}
    });

    if (!business) {
        throw Error('No business found');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    business.password = hash;
    business.resetPasswordToken = undefined;
    business.resetPasswordTokenExpiry = undefined;
    await business.save();

    return business;
}

// Add employee method
businessSchema.statics.addEmployee = async function(businessID: string, firstName: string, lastName: string, password: string, background: string, foreground: string) {
    if (!businessID || !firstName || !lastName || !password || !background || !foreground) {
        throw Error('All fields must be filled');
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const employee = await EmployeeModel.create({
        firstName: firstName,
        lastName: lastName,
        password: hash,
        foreground: foreground,
        background: background,
    });

    business.employees.push(employee._id);

    business.save();

    return employee;

}

// Update employee method 
businessSchema.statics.updateEmployee = async function(businessID: string, employeeID: string, firstName: string, lastName: string, password: string, background: string, foreground: string) {
    if (!businessID || !employeeID || !firstName || !lastName || !password || !background || !foreground) {
        throw Error('All fields must be filled');
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const employee = await EmployeeModel.findOneAndUpdate({_id: employeeID}, {
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
}

// Delete employee method
businessSchema.statics.deleteEmployee = async function(businessID: string, employeeID: string) {
    if (!businessID || !employeeID) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    const employee = await EmployeeModel.findByIdAndDelete(employeeID);

    if (!employee) {
        throw Error('No employee found');
    }

    const shifts = await ShiftModel.find({ _id: { $in: business.shifts }, employeeID: employeeID }).select('_id');

    // Delete all shifts with the position
    if (shifts.length >= 1) {
        await ShiftModel.deleteMany({ _id: { $in: shifts } });
    }

    const shiftsWithEmployeeIds = shifts.map(shift => shift._id.toString());

    // Pull the shifts from the business and weeks
    await business.shifts.pull(...shifts);

    await Promise.all(
        business.weeks.map(async (weekID: any) => {
            const week = await WeekModel.findOne({ _id: weekID });
            week.shifts = week.shifts.filter((shift: any) => !shiftsWithEmployeeIds.includes(shift.toString()));
            await week.save();
        })
    );
    
    business.employees = business.employees.filter((employee: any) => employee._id !== employeeID);

    business.save();

    return employee;
}

// Get all employees method
businessSchema.statics.getAllEmployees = async function(businessID: string) {
    if (!businessID) {
        throw Error('No business ID provided');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    const employees = await EmployeeModel.find({ _id: {$in: business.employees}});
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
}

// Add new week method
businessSchema.statics.addWeek = async function(businessID: string, weekNumber: number, year: number, startDate: Date, endDate: Date) {
    if (!businessID || !weekNumber || !year || !startDate || !endDate) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }
    
    const existingWeek = await WeekModel.findOne({weekNumber: weekNumber, year: year});
    
    if (existingWeek) {
        throw Error('Week already exists');
    }

    const previousWeekID = (business.weeks.length >= 1) ? business.weeks[business.weeks.length - 1].toString() : null;

    // Check if the previous week exists, if not, create a new week
    if (!previousWeekID) {
        const week = await WeekModel.create({
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
    const previousWeek = await WeekModel.findById(previousWeekID);

   // Copy the shifts from the previous week
    const newShifts = await Promise.all(previousWeek.shifts.map(async(shiftID: any) => {
        const foundShift = await ShiftModel.findById(shiftID);
        const newShift = await ShiftModel.create({
            businessID: foundShift.businessID,
            employeeID: foundShift.employeeID,
            year: foundShift.year,
            position: foundShift.position,
            dayOfWeek: foundShift.dayOfWeek,
            startTime: foundShift.startTime,
            endTime: foundShift.endTime,
        });
        return newShift._id;
    }));

    // Create the new week
    const newWeek = await WeekModel.create({
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
}

// Delete week method
businessSchema.statics.deleteWeek = async function(businessID: string, weekID: string) {
    if (!businessID || !weekID) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    const week = await WeekModel.findByIdAndDelete(weekID);

    if (!week) {
        throw Error('No week found');
    }

    const shifts = await ShiftModel.find({_id: {$in: week.shifts}}).select('_id');
    await ShiftModel.deleteMany({_id: {$in: shifts}});
    await business.shifts.pull(shifts);
    WeekModel.findByIdAndDelete(weekID);

    business.weeks = business.weeks.filter((week: any) => week._id !== weekID);
    business.save();
    return week;
}

// Add new position method
businessSchema.statics.addPosition = async function(businessID: string, name: string) {
    if (!businessID || !name) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    if (business.positions.includes(name)) {
        throw Error('Position already exists');
    }

    business.positions.push(name);
    business.save();
    return business;
}

// Update all positions method
businessSchema.statics.updatePositions = async function(businessID: string, positions: []) {
    if (!businessID || !positions) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    business.positions = positions;
    business.save();
    return business;
}

// Delete position method
businessSchema.statics.deletePosition = async function(businessID: string, positionID: string) {
    if (!businessID || !positionID) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    if (!business.positions.includes(positionID)) {
        throw Error('Position does not exist');
    }

    // Delete all shifts with the position
    const shiftsWithPosition = await ShiftModel.find({ _id: { $in: business.shifts }, position: positionID }).select('_id');
    if (shiftsWithPosition.length >= 1) {
        await ShiftModel.deleteMany({ _id: { $in: shiftsWithPosition } });
    }

    const shiftsWithPositionIds = shiftsWithPosition.map(shift => shift._id.toString());

    // Pull the shifts from the business and weeks
    await business.shifts.pull(...shiftsWithPosition);

    await Promise.all(
        business.weeks.map(async (weekID: any) => {
            const week = await WeekModel.findOne({ _id: weekID });
            week.shifts = week.shifts.filter((shift: any) => !shiftsWithPositionIds.includes(shift.toString()));
            await week.save();
        })
    );

    // Pull the position from the business
    const positionIndex = business.positions.findIndex((position: any, index: any) => position === positionID);
    if (positionIndex !== -1) {
        business.positions.splice(positionIndex, 1);
    }
    business.save();
    return business;
}

// Get all positions method
businessSchema.statics.getAllPositions = async function(businessID: string) {
    if (!businessID) {
        throw Error('No business ID provided');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }

    return business.positions;
}

// Add new shift method
businessSchema.statics.addShift = async function(businessID: string, employeeID: string, weekNumber: number, year: number, position: string, dayOfWeek: number, startTime: string, endTime: string) {
    if (!businessID || !employeeID || !year || !position || !dayOfWeek || !startTime || !endTime || !weekNumber) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }
    
    const employee = await EmployeeModel.findOne({ _id: employeeID });
    
    if (!employee) {
        throw Error('No employee found');
    }

    const week = await WeekModel.findOne({businessID: businessID, year: year, weekNumber: weekNumber});

    if (!week) {
        throw Error('No week found');
    }

    // Check if the shift overlaps with another shift, must be of the same position, so a shift of the same position, on the same day, cannot overlap
    const getDecimalHours = (time:string) => {
        const [hours, minutes] = time.split(':');
        const minuteDecimal = parseInt(minutes) / 60;
        return parseInt(hours) + minuteDecimal;
    }

    let overlappingShift = false;
    console.log(dayOfWeek)
    for (const shiftID of week.shifts) {
        const foundShift = await ShiftModel.findById(shiftID);
        // console.log('[Debug]:', foundShift)

        if (foundShift !== null && foundShift.dayOfWeek === dayOfWeek && foundShift.position === position) {
            const startTimeDecimal = getDecimalHours(startTime);
            const endTimeDecimal = getDecimalHours(endTime);
            const foundShiftStartTimeDecimal = getDecimalHours(foundShift.startTime);
            const foundShiftEndTimeDecimal = getDecimalHours(foundShift.endTime);

            if (
                (startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal > foundShiftStartTimeDecimal &&
                    endTimeDecimal <= foundShiftEndTimeDecimal) ||
                (startTimeDecimal > foundShiftStartTimeDecimal &&
                    startTimeDecimal < foundShiftEndTimeDecimal &&
                    endTimeDecimal >= foundShiftEndTimeDecimal) ||
                (startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal >= foundShiftEndTimeDecimal)
            ) {
                overlappingShift = true;
                break;
            }
        }
    }
    // console.log('B')

    if (overlappingShift) {
        throw Error('Shift overlaps with another shift');
    }

    console.log('A')

    const shift = await ShiftModel.create({businessID: businessID, year: year, employeeID: employeeID, position: position, dayOfWeek: dayOfWeek, startTime: startTime, endTime: endTime});
    week.shifts.push(shift);
    business.shifts.push(shift);

    console.log('B')

    business.save();
    week.save();

    return shift;
}

businessSchema.statics.deleteShift = async function(businessID: string, shiftID: string) {
    if (!businessID || !shiftID) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }
    
    const shift = await ShiftModel.findByIdAndDelete(shiftID);

    if (!shift) {
        throw Error('No shift found');
    }

    const week = await WeekModel.findOne({shifts: shiftID});

    if (!week) {
        throw Error('No week found');
    }

    business.shifts = business.shifts.filter((id: any) => id.toString() !== shiftID);
    week.shifts = week.shifts.filter((id: any) => id.toString() !== shiftID);

    await week.save();
    await business.save();

    return shift;
}

// Update shift method
businessSchema.statics.updateShift = async function(businessID: string, shiftID: string, employeeID: string, position: string, dayOfWeek: number, startTime: string, endTime: string, year: number, weekNumber: number) {
    if (!businessID || !shiftID || !employeeID || !position || !dayOfWeek || !startTime || !endTime || !year || !weekNumber) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }
    const employee = await EmployeeModel.findOne({ _id: employeeID });
    
    if (!employee) {
        throw Error('No employee found');
    }

    const week = await WeekModel.findOne({businessID: businessID, year: year, weekNumber: weekNumber});

    if (!week) {
        throw Error('No week found');
    }

    // Check if the shift overlaps with another shift, must be of the same position, so a shift of the same position, on the same day, cannot overlap
    const getDecimalHours = (time:string) => {
        const [hours, minutes] = time.split(':');
        const minuteDecimal = parseInt(minutes) / 60;
        return parseInt(hours) + minuteDecimal;
    }

    let overlappingShift = false;

    for (const shiftIDInWeek of week.shifts) {
        const foundShift = await ShiftModel.findById(shiftIDInWeek);

        if (foundShift !== null && foundShift.dayOfWeek === dayOfWeek && foundShift.position === position && foundShift._id.toString() !== shiftID) {
            const startTimeDecimal = getDecimalHours(startTime);
            const endTimeDecimal = getDecimalHours(endTime);
            const foundShiftStartTimeDecimal = getDecimalHours(foundShift.startTime);
            const foundShiftEndTimeDecimal = getDecimalHours(foundShift.endTime);

            if (
                (startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal > foundShiftStartTimeDecimal &&
                    endTimeDecimal <= foundShiftEndTimeDecimal) ||
                (startTimeDecimal > foundShiftStartTimeDecimal &&
                    startTimeDecimal < foundShiftEndTimeDecimal &&
                    endTimeDecimal >= foundShiftEndTimeDecimal) ||
                (startTimeDecimal <= foundShiftStartTimeDecimal &&
                    endTimeDecimal >= foundShiftEndTimeDecimal)
            ) {
                overlappingShift = true;
                break;
            }
        }
    }

    if (overlappingShift) {
        throw Error('Shift overlaps with another shift');
    }


    const shift = await ShiftModel.findOneAndUpdate({_id: shiftID}, {employeeID: employeeID, position: position, dayOfWeek: dayOfWeek, startTime: startTime, endTime: endTime});

    if (!shift) {
        throw Error('No shift found');
    }

    return shift;
}

// Get all shifts for a week method
businessSchema.statics.getAllShifts = async function(businessID: string, weekNumber: number, year: number) {
    if (!businessID || !weekNumber || !year) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

    if (!business) {
        throw Error('No business found');
    }
    
    const week = await WeekModel.findOne({weekNumber: weekNumber, year: year});

    if (!week) {
        throw Error('No week found');
    }

    const shifts = await ShiftModel.find({_id: {$in: week.shifts}});

    if (!shifts) {
        throw Error('No shifts found');
    }

    return shifts;
}

// Get business profile data method
businessSchema.statics.getProfile = async function(businessID: string) {
    if (!businessID) {
        throw Error('No business ID provided');
    }

    const business = await this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -weeks -employees');

    if (!business) {
        throw Error('No business found');
    }

    return business;
}

// Update business profile data method
businessSchema.statics.updateProfile = async function(businessID: string, businessName: string, streetLine1: string, streetLine2: string, city: string, postCode: string, ownerFirstName: string, ownerLastName: string, darkMode: boolean) {
    if (!businessID || !businessName || !streetLine1 || !city || !postCode || !ownerFirstName || !ownerLastName) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID });

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
}

// Add finances method
businessSchema.statics.addFinances = async function(businessID: string, year: number, weekNumber: number, dayOfWeek: string, income: number, uber: number, expense: number, notes: string) {
    
    console.log('A')

    if (!businessID || !year || !weekNumber || !dayOfWeek || !income || !uber || !expense || !notes) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -shifts -weeks -employees');

    if (!business) {
        throw Error('No business found');
    }
    
    const week = await WeekModel.findOne({ year: year, weekNumber: weekNumber });
    console.log('B')

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

    console.log('C')

    week.finances[dayOfWeek_].income = income;
    week.finances[dayOfWeek_].uber = uber;
    week.finances[dayOfWeek_].expense = expense;
    week.finances[dayOfWeek_].notes = notes;
    console.log(week.finances[dayOfWeek_])
    await week.save();

    return week.finances;
}

// Get finances method
businessSchema.statics.getFinances = async function(businessID: string, year: number, weekNumber: number) {
    if (!businessID || year === undefined || weekNumber === undefined) {
        throw Error('All fields must be filled');
    }

    const business = await this.findOne({ _id: businessID }).select('-password -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry -__v -shifts -weeks -employees');

    if (!business) {
        throw Error('No business found');
    }
    
    const week = await WeekModel.findOne({ year: year, weekNumber: weekNumber });

    if (!week) {
        throw Error('No week found');
    }

    return week.finances;

}

const BusinessModel: BusinessModel = model<Business, BusinessModel>('Business', businessSchema);
export default BusinessModel;