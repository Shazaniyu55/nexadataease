const { Schema, model } = require("mongoose");
const fileSchema = require("./fileSchema");

module.exports = model("Instructor", new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    country: String,
    qualification: String,
    yearsExperience: Number,
    employer: String,
    expertise: [String],
    linkedin: String,
    teachingExperience: String,
    bio: String,
    cv: { type: fileSchema, default: null },
    certificates: { type: [fileSchema], default: [] },
    status: { type: String, enum: ["incomplete", "pending", "approved", "rejected"], default: "incomplete" },
    reviewNote: { type: String, default: "" },
    reviewedAt: Date,
  },
  { timestamps: true }
));