const { Schema, model } = require("mongoose");

const attempt = new Schema(
  { score: Number, total: Number, pct: Number, passed: Boolean, date: { type: Date, default: Date.now } },
  { _id: false }
);

const studentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    password: { type: String, required: true },
    course: { type: String, required: true },
    progress: { type: [Number], default: [] },
    cbtAttempts: { type: [attempt], default: [] },
    cbtActive: { type: new Schema({ deadline: Number }, { _id: false }), default: null },
    reset: { type: new Schema({ hash: String, expires: Number }, { _id: false }), default: null },
  },
  { timestamps: true }
);

module.exports = model("Student", studentSchema);
