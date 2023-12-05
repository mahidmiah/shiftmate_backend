import mongoose, { Schema } from "mongoose";

const weekSchema = new mongoose.Schema({
    businessID: String,
    weekNumber: Number,
    year: Number,
    weekStartDate: String,
    weekEndDate: String,
    shifts: [{ type: Schema.Types.ObjectId, ref: 'Shift', default: [] }],
    finances: {
        Monday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Tuesday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Wednesday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Thursday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Friday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Saturday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
        Sunday: { income: { type: Number, default: 0 }, uber: { type: Number, default: 0 }, expense: { type: Number, default: 0 }, notes: { type: String, default: "" } },
    }
});

const WeekModel = mongoose.models.Week || mongoose.model('Week', weekSchema);

export default WeekModel;